/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 14:52
 * @Email: middle2021@gmail.com
 */
import produce from 'immer';
const AUTH_MODEL = {
  NAMESPACE: 'auth',
  REDUCERS: {},
  EFFECTS: {},
  concatNamespace: type => `${AUTH_MODEL.NAMESPACE}/${type}`,
};

const defaultState = {
  auth: {
    a: 1,
  },
};

const model = {
  namespace: AUTH_MODEL.NAMESPACE,
  state: defaultState,
  reducers: {
    updateState(state, action) {
      return produce(state, draft => {
        draft.auth.a = 2;
      });
    },
  },
  effects: {},
};

export {AUTH_MODEL};
export default model;
