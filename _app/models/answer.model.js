/*
 * @Author: middle
 * @Desc: answer
 * @Date: 2020/1/12 15:56
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
import {ApiService} from '../http/APIService';
import _ from 'lodash';

const initState = {
  info: {},
  // 当前位于第几题
  curIndex: 0,

  // 是否完成全部答题
  isSuccessfully: false,
};

const model = {
  namespace: 'answer',
  state: _.cloneDeep(initState),
  reducers: {
    updateInfo(state, {payload}) {
      return produce(state, draft => {
        draft.info = payload;
      });
    },
    reset (state) {
      return produce(state, draft => {
        Object.assign(draft, _.cloneDeep(initState));
      });
    },
    updateCurIndex (state, { payload }) {
      return produce(state, draft => {
        draft.curIndex = payload;
      });
    },
    updateOptions (state, { payload }) {
      return produce(state, draft => {
        const { _index, _checked } = payload;
        // 更新多选题
        draft.info.questionnaire.subjects[draft.curIndex].options[_index]._checked = _checked;
      });
    },
    updateOptionsSingle (state, { payload }) {
      return produce(state, draft => {
        const { _index, _checked } = payload;
        // 更新单选题
        const options = draft.info.questionnaire.subjects[draft.curIndex].options;

        options.forEach(v => {
          v._checked = false;
        });
        options[_index]._checked = _checked;
      });
    },
    /**
     * 更新选项
     * @param state
     * @param payload
     */
    updateOptionsByFeedBack (state, { payload }) {
      return produce(state, draft => {
        const options = draft.info.questionnaire.subjects[draft.curIndex - 1].options;
        options.forEach(v => {
          const hasOption = _.some(payload, { optionId: v.optionId });
          if (hasOption) {
            // 有匹配到
            v._checked = true;
          }
        });
        // 更新单选题
        draft.info.questionnaire.subjects[draft.curIndex - 1].options = options;
      });
    },
    updateSuccessfully (state, { payload }) {
      return produce(state, draft => {
        draft.isSuccessfully = true
      })
    }
  },
  effects: {
    loadData: [
      function*({payload}, {call, put}) {
        /*eslint prettier/prettier:0*/
        const [error, data] = yield call(ApiService.questionnaireDetails, payload);
        if (error) {
          return Promise.reject(error);
        }

        const { feedback } = data

        if (feedback) {
          const { feedbackSubjectNum } = feedback;
          yield put({
            type: 'updateCurIndex',
            payload: feedbackSubjectNum,
          });
        }

        yield put({
          type: 'updateInfo',
          payload: data,
        });
      },
      {take: 'Latest'},
    ],
    //上一题
    feedbackOptions: [
      function*({payload}, {call, put, select}) {
        /*eslint prettier/prettier:0*/
        const { curItem, userQuestionnaireId, questionnaireId } = payload;

        const params = {
          userQuestionnaireId,
          questionnaireId,
          subjectId: curItem.subjectId,
        };

        const [error, data] = yield call(ApiService.feedbackOptions, params);
        if (error) {
          return Promise.reject(error);
        }

        const curIndex = yield select((state) => state.answer.curIndex);

        yield put({
          type: 'updateOptionsByFeedBack',
          payload: data
        })

        yield put({
          type: 'updateCurIndex',
          payload: curIndex - 1,
        });

      },
      {take: 'Latest'},
    ],

    answer: [
      function*({payload}, {call, put, select}) {
        /*eslint prettier/prettier:0*/

        const { curItem, userQuestionnaireId, questionnaireId } = payload;

        const params = {
          userQuestionnaireId,
          questionnaireId,
          subjectId: curItem.subjectId,
          answerOptionJson: processAnswerOptions(curItem.options),
        }
        const [error, data] = yield call(ApiService.answer, params);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(data)
      },
      {take: 'Latest'},
    ],
  },
};

function processAnswerOptions (options) {
  const result = options.filter(v => v._checked).reduce((pre, cur) => {
    pre.push({
      optionId: cur.optionId,
      optionKey: cur.optionKey,
      fillingValue: cur.fillingValue,
    });
    return pre
  }, []);

  return JSON.stringify(result)
}

export default model;
