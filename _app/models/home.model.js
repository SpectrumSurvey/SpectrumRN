/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 14:52
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
import {ApiService} from '../http/APIService';

const initState = {
  info: {},
};

const model = {
  namespace: 'home',
  state: initState,
  reducers: {
    updateInfo(state, {payload}) {
      return produce(state, draft => {
        draft.info = payload;
      });
    },
  },
  effects: {
    loadData: [
      function*({payload}, {call, put}) {
        const [error, data] = yield call(ApiService.home, payload);
        if (error) {
          return Promise.reject(error);
        }
        yield put({
          type: 'updateInfo',
          payload: data,
        });
      },
      {take: 'Latest'},
    ],
  },
};

export default model;
