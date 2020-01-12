/*
 * @Author: middle
 * @Desc: APIUtil
 * @Date: 2020/1/11 14:19
 * @Email: middle2021@gmail.com
 */
import {DvaInstance} from '../utils/dva';

const APIUtil = {
  createSystemParams() {
    const store = DvaInstance.instance._store.getState();

    return {
      // ██████ 鉴权 ██████
      // 账户token
      _st: store.auth.token,
    };
  },
};

export {APIUtil};
