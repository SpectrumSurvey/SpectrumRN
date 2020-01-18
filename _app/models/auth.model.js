/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 14:52
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
import {ApiService} from '../http/APIService';
import {AsyncStorage} from '../utils/storage';
const AUTH_MODEL = {
  NAMESPACE: 'auth',
  REDUCERS: {},
  EFFECTS: {},
  concatNamespace: type => `${AUTH_MODEL.NAMESPACE}/${type}`,
};

const initState = {
  token: '',
  // 用户详情
  userDetails: {},
  // 是否已经初始化
  init: false,
};

const model = {
  namespace: AUTH_MODEL.NAMESPACE,
  state: initState,
  reducers: {
    logOutSuccess(state) {
      // 清空本地
      return produce(state, draft => {
        draft.token = '';
      });
    },
    loginSuccess(state, {payload}) {
      return produce(state, draft => {
        Object.assign(draft, payload);
      });
    },
    updateUserDetail(state, {payload}) {
      return produce(state, draft => {
        draft.userDetails = payload
      });
    },
  },
  effects: {
    login: [
      function*({payload}, {call, put}) {
        const [error, data] = yield call(ApiService.login, payload);
        if (error) {
          return Promise.reject(error);
        }

        yield call(AsyncStorage.setItem, 'token', data.token);

        yield put({
          type: 'loginSuccess',
          payload: {
            token: data.token,
            init: true
          },
        });

        try {
          // 更新用户信息
          yield put({ type: 'userDetails' });
        } catch (e) {

        }
      },
      {take: 'Latest'},
    ],
    logOut: [
      function*({payload}, {call, put}) {
        yield call(AsyncStorage.removeItem, 'token');

        yield put({
          type: 'logOutSuccess',
        });
      },
      {take: 'Latest'},
    ],

    checkLogin: [
      function*({payload}, {call, put}) {

        const token = yield call(AsyncStorage.getItem, 'token');

        if (token) {
          yield put({
            type: 'loginSuccess',
            payload: {
              token,
              init: true
            },
          });

          try {
            // 更新用户信息
            yield put({ type: 'userDetails' });
          } catch (e) {
          }
          return true
        } else {
          yield put({
            type: 'loginSuccess',
            payload: {
              init: true
            },
          });
          return false
        }
      },
      {take: 'Latest'},
    ],

    userDetails: [
      function*({payload}, {call, put}) {
        const [error, data] = yield call(ApiService.userDetails, payload);
        if (error) {
          return Promise.reject(error)
        }

        yield put({
          type: 'updateUserDetail',
          payload: data,
        });
      },
      {take: 'Latest'},
    ],
  },
};

export {AUTH_MODEL};
export default model;
