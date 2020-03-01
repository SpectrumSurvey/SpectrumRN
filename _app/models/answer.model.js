/*
 * @Author: middle
 * @Desc: answer
 * @Date: 2020/1/12 15:56
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
import { ApiService } from '../http/APIService';
import _ from 'lodash';
import { SUBJECT_ENUM } from '../utils/constant';
import moment from 'moment';

const initState = {
  info: {},
  // 当前位于第几题
  curIndex: 0,
  startTime: 0,
  // 是否完成全部答题
  isSuccessfully: false,

  // 每一题开始时间
  subjectStartTime: 0,
};

const model = {
  namespace: 'answer',
  state: _.cloneDeep(initState),
  reducers: {
    updateInfo (state, { payload }) {
      return produce(state, draft => {
        draft.info = payload;
        draft.startTime = new Date().getTime();
      });
    },
    updateSubjectStartTime (state) {
      return produce(state, draft => {
        draft.subjectStartTime = moment().valueOf();
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
        // 重新计算题目开始时间
        draft.subjectStartTime = moment().valueOf();
      });
    },
    /**
     * 更新多选选项
     * @param state
     * @param payload
     */
    updateOptions (state, { payload }) {
      return produce(state, draft => {
        try {
          const { _index, ...values } = payload;
          // 更新多选题
          const _option = draft.info.questionnaire.subjects[draft.curIndex].options[_index];
          Object.assign(_option, values);
        } catch (e) {
        }
      });
    },
    /**
     * 更新单选
     * @param state
     * @param payload
     */
    updateOptionsSingle (state, { payload }) {
      return produce(state, draft => {
        try {
          const { _index, ...values } = payload;
          // 更新单选题
          const options = draft.info.questionnaire.subjects[draft.curIndex]?.options;

          options?.forEach(v => {
            v._checked = false;
            v.fillingValue = '';
          });

          Object.assign(options[_index], values);
        } catch (e) {
        }
      });
    },

    /**
     * 填空题更新答案
     * @param state
     * @param payload
     */
    updateOptionsByInput (state, { payload }) {
      return produce(state, draft => {
        try {
          const value = payload;
          // 更新填空题
          const options = draft.info.questionnaire.subjects[draft.curIndex].options;
          options[0].optionKey = value;
        } catch (e) {
        }
      });
    },

    /**
     * 下拉单选框
     * @param state
     * @param payload
     */
    updateOptionByDropDownSingle (state, { payload }) {
      return produce(state, draft => {
        try {
          const { _index } = payload;
          // 更新下拉单选题
          const options = draft.info.questionnaire.subjects[draft.curIndex].options;

          options.forEach(v => {
            v._checked = false;
          });

          options[_index]._checked = true;
        } catch (e) {
        }
      });
    },

    /**
     * 下拉多选框
     * @param state
     * @param payload
     */
    updateOptionByDropDownMultiple (state, { payload }) {
      return produce(state, draft => {
        try {
          const { ids } = payload;
          // 更新下拉多选题
          const options = draft.info.questionnaire.subjects[draft.curIndex].options;

          options.forEach(v => {
            v._checked = !!ids.includes(v.optionId);
          });
        } catch (e) {
        }
      });
    },
    /**
     * 更新选项
     * @param state
     * @param payload
     */
    updateOptionsByFeedBack (state, { payload }) {

      const { data, subjectType } = payload;

      if (_.isEmpty(data)) {
        return produce(state, draft => {});
      }

      return produce(state, draft => {
        try {
          if (
            subjectType === SUBJECT_ENUM.MULTIPLE_CHOICE ||
            subjectType === SUBJECT_ENUM.SINGLE_CHOICE ||
            subjectType === SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE ||
            subjectType === SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE ||
            subjectType === SUBJECT_ENUM.SCALE
          ) {
            // 选择题 量表题
            const options = draft.info.questionnaire.subjects[draft.curIndex - 1].options;
            options.forEach(v => {
              const option = _.find(data, { optionId: v.optionId });
              if (option) {
                // 有匹配到
                v._checked = true;
                v.fillingValue = option.fillingValue;
              }
            });
            // 更新单选题
            draft.info.questionnaire.subjects[draft.curIndex - 1].options = options;
          }

          if (subjectType === SUBJECT_ENUM.COMPLETION) {
            // 填空题
            draft.info.questionnaire.subjects[draft.curIndex - 1].options[0].optionKey = data[0].optionKey;
          }
        } catch (e) {
        }
      });
    },
    updateSuccessfully (state, { payload }) {
      return produce(state, draft => {
        draft.isSuccessfully = true;
      });
    },
  },
  effects: {
    loadData: [
      function * ({ payload }, { call, put }) {
        /*eslint prettier/prettier:0*/
        const [error, data] = yield call(ApiService.questionnaireDetails, payload);
        if (error) {
          return Promise.reject(error);
        }

        const { feedback, questionnaire } = data;

        yield put({
          type: 'updateInfo',
          payload: data,
        });

        yield put({
          type: 'updateSubjectStartTime',
        });

        if (feedback) {
          const { lastSubjectId } = feedback;
          const lastIndex = _.findIndex(questionnaire.subjects, { subjectId: lastSubjectId });
          if (lastIndex !== questionnaire.subjects.length - 1) {
            // 最后一题未答完
            yield put({
              type: 'updateCurIndex',
              payload: lastIndex + 1,
            });
          }
        }
      },
      { take: 'Latest' },
    ],
    //上一题
    feedbackOptions: [
      function * ({ payload }, { call, put, select }) {
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
          payload: {
            data,
            subjectType: curItem?.subjectType,
          },
        });

        yield put({
          type: 'updateCurIndex',
          payload: curIndex - 1,
        });

      },
      { take: 'Latest' },
    ],

    answer: [
      function * ({ payload }, { call, select }) {
        /*eslint prettier/prettier:0*/

        const startTime = yield select(state => state.answer.subjectStartTime);
        // 答题时长
        const duration = moment().diff(moment(startTime), 'seconds');

        const { curItem, userQuestionnaireId, questionnaireId } = payload;

        const options = processAnswerOptions(curItem.subjectType, curItem.options);

        if (!_.isEmpty(options)) {
          options.forEach(v => {
            v.duration = duration;
          });
        }

        const params = {
          userQuestionnaireId,
          questionnaireId,
          subjectId: curItem.subjectId,
          answerOptionJson: _.isEmpty(options) ? null : JSON.stringify(options),
        };
        const [error, data] = yield call(ApiService.answer, params);
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve(data);
      },
      { take: 'Latest' },
    ],
  },
};

function processAnswerOptions (subjectType, options) {
  if ([
    SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE,
    SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE,
    SUBJECT_ENUM.SINGLE_CHOICE,
    SUBJECT_ENUM.MULTIPLE_CHOICE,
  ].includes(subjectType)) {
    const result = options.filter(v => v._checked).reduce((pre, cur) => {
      pre.push({
        optionId: cur.optionId,
        optionKey: cur.optionKey,
        fillingValue: cur.fillingValue,
      });
      return pre;
    }, []);

    return result;
  }

  if (
    subjectType === SUBJECT_ENUM.COMPLETION
  ) {
    // 填空题
    return [
      {
        optionId: options[0].optionId,
        // 填空题结果
        optionKey: options[0].optionKey,
        fillingValue: null,
      },
    ];
  }

  if (subjectType === SUBJECT_ENUM.SCALE) {
    // 量表题
    const cur = options.filter(v => v._checked)[0];
    return [{
      optionId: cur.optionId,
      optionKey: cur.optionKey,
      fillingValue: cur.fillingValue,
    }];
  }

}

export default model;
