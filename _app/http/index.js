/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/11 14:14
 * @Email: middle2021@gmail.com
 */
// axios 更多文档参考 https://github.com/axios/axios
import axios from 'axios';
import { APIInterceptor } from './APIInterceptors';
import config from '../../app.json'

// interceptors.request 先触发
// transformRequest 后触发

// interceptors.request.use (后加入，先触发）
// interceptors.response.use (先加入，先触发）

const HTTP = axios.create({
  baseURL: config.url,
  timeout: 8000,
});

HTTP.interceptors.request.use(...APIInterceptor.transParams);
HTTP.interceptors.response.use(...APIInterceptor.dispatchByResStatus);
HTTP.interceptors.response.use(...APIInterceptor.handleError);
HTTP.interceptors.response.use(...APIInterceptor.flattenRes);
HTTP.interceptors.response.use(...APIInterceptor.interFlow);

export { HTTP };
