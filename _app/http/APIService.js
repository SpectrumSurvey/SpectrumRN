/*
 * @Author: middle
 * @Desc: APIService
 * @Date: 2020/1/11 14:25
 * @Email: middle2021@gmail.com
 */
import { HTTP } from './index';

const ApiService = {
  login: async (data) => {
    return HTTP.post('app-user-login-code/login', data);
  },
  home: async (params = {}) => {
    return HTTP.get('app-home/home', { params: { ...params, $skipLoading: true} });
  },
  userDetails: async (params = {}) => {
    return HTTP.get('app-user-login-code/details', { params: { ...params, $skipLoading: true} });
  },
  questionnaireDetails: async (params) => {
    return HTTP.get('app-questionnaire/details', { params });
  },
  answer: async (data) => {
    return HTTP.post('app-feedback/answer', { ...data, $skipLoading: true });
  },
  feedbackOptions: async (data = {}) => {
    return HTTP.post('app-feedback/feedback-option', { ...data, $skipLoading: true });
  },
  submit: async (data = {}) => {
    return HTTP.post('app-feedback/submit', { ...data, $skipLoading: true } )
  }
};

export { ApiService };