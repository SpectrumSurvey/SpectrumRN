import _ from 'lodash';
import qs from 'qs';
import {APIUtil} from './APIUtil';
import {APINetworkConstant} from './APINetwork.constant';
import {objectUtil} from '../utils/object.util';
import {hideLoopToast, showLoopToast, showToast} from '../utils/utils';
import {DvaInstance} from '../utils/dva';
import { Alert } from 'react-native';

const APIInterceptor = {
  /**
   * 转换请求参数的拦截器
   *
   * 1. 添加系统级参数
   * 2. 移除空值参数，值为 undefined null ''
   * 3. 当为 post put 等请求时，把参数放到 data 上
   *
   */
  transParams: [
    config => {
      const configCopy = _.cloneDeep(config);
      const defaultSystemParams = APIUtil.createSystemParams();

      if (configCopy?.params?.$skipLoading || configCopy?.data?.$skipLoading) {
        configCopy.$skipLoading = true;
        configCopy?.params?.$skipLoading && delete configCopy.params.$skipLoading;
        configCopy?.data?.$skipLoading && delete configCopy.data.$skipLoading;
      } else {
        showLoopToast();
      }

      // 判断是否有特殊参数
      if (configCopy?.params?.$skipErrorToast) {
        configCopy.$skipErrorToast = true;
        delete configCopy.params.$skipErrorToast;
      }

      if (configCopy?.data?.$skipErrorToast) {
        configCopy.$skipErrorToast = true;
        delete configCopy.data.$skipErrorToast;
      }

      let params = {
        ...defaultSystemParams,
        ...(configCopy.params || {}),
      };

      configCopy.params = objectUtil.dropEmptyValue(params);

      if (
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())
      ) {
        // 1. 如果是 post 等类型请求，则把 params 合并到 data 中
        // 2. 如果 data 是 FormData 构造的，则把 params 添入其中
        // 3. 否则直接序列化
        // 4. 删除 params
        if (configCopy?.data?.constructor === FormData) {
          configCopy.headers['Content-Type'] = 'multipart/form-data';
          Object.keys(configCopy.params).forEach(key => {
            configCopy.data.append(key, configCopy.params[key]);
          });
        } else {
          configCopy.headers['Content-Type'] =
            'application/x-www-form-urlencoded';

          configCopy.data = {
            ...configCopy.params,
            ...configCopy.data,
          };

          configCopy.data = qs.stringify(configCopy.data);
        }

        delete configCopy.params;
      }

      return configCopy;
    },
  ],

  /**
   * 根据响应状态分发结果的拦截器
   * 这里只根据状态来分类是否「resolve」或「reject」
   * 对于异常的处理使用别的拦截器
   */
  dispatchByResStatus: [
    /**
     * 1. 判断 response.errorCode 是否为 0 ，是则通过，不是则拒绝
     * @param response
     */
    response => {
      if (!response.data || response.data.errorCode !== 0) {
        return Promise.reject(response);
      }

      return response;
    },
  ],

  /**
   * 处理失败响应的拦截器
   */
  handleError: [
    response => {
      hideLoopToast();
      return response;
    },
    error => {
      hideLoopToast();
      // 权限错误
      if (
        APINetworkConstant.codeStatus.tokenExpired.value ===
        error?.data?.errorCode
      ) {
        !error?.config?.$skipErrorToast &&
          showToast('登录权限校验失败，请重新登录');

        DvaInstance.instance._store.dispatch({type: 'auth/logOut'});

        return Promise.reject(error);
      }

      // 可识别错误
      if (
        [
          APINetworkConstant.codeStatus.serverCodeError.value,
          APINetworkConstant.codeStatus.invalidSystemParams.value,
        ].includes(error?.data?.code)
      ) {
        !error?.config?.$skipErrorToast && showToast('服务器系统异常');

        return Promise.reject(error);
      }

      !error?.config?.$skipErrorToast &&
        showToast(error?.data?.msg || error?.data?.message || '数据请求失败');

      return Promise.reject(error);
    },
  ],

  /**
   * 减少一级 response 结构
   */
  flattenRes: [
    response => {
      return response?.data?.data;
    },
  ],

  /**
   * 合流，把 resolve 和 reject 合到一个数组中
   * 这意味着接下来的 promise 一定会进入 resolve 中
   * 这个 resolve 接收到参数为数组 [err, res]
   * 如果请求过车中有任何错误，都会放在数组的第一个值中，如果没有错误则 err 为 null
   */
  interFlow: [response => [null, response], error => [error, null]],
};

export {APIInterceptor};
