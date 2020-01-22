/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 14:52
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
import { ApiService } from '../http/APIService';

const initState = {
  list: [],
  loading: false,
};

const model = {
  namespace: 'msg',
  state: initState,
  reducers: {
    updateList (state, { payload }) {
      return produce(state, draft => {
        draft.list = payload;
      });
    },
    updateLoading (state, { payload }) {
      return produce(state, draft => {
        draft.loading = payload;
      });
    },
  },
  effects: {
    loadData: [
      function * ({ payload }, { call, put }) {
        yield put({ type: 'updateLoading', payload: true });
        const [error, data] = yield call(ApiService.msgList, payload);
        yield put({ type: 'updateLoading', payload: false });
        if (error) {
          return Promise.reject(error);
        }
        yield put({
          type: 'updateList',
          payload: data,
        });
      },
      { take: 'Latest' },
    ],
  },
};

export default model;
