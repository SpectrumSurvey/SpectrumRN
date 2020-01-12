/*
 * @Author: middle
 * @Desc: APINetwork.constant
 * @Date: 2020/1/11 14:18
 * @Email: middle2021@gmail.com
 */
// 后端服务返回状态常量
const APINetworkConstant = {
  /**
   * @desc http status 200 时，reponse.code 对应的枚举值
   * @typedef {object} APINetwork_Constant_CodeStatus
   */
  codeStatus: {
    successful: {
      value: 0,
      message: '服务正常',
    },
    serverCodeError: {
      value: 1,
      message: '服务器代码异常',
    },
    invalidSystemParams: {
      value: 3,
      message: '系统参数错误',
    },
    tokenExpired: {
      value: 402,
      message: '权限过期',
    },
    medicalInstitutionExpired: {
      value: 403,
      message: '所属机构过期',
    },
    URLNotFound: {
      value: 404,
      message: '请求地址失效',
    },
  },
};

export { APINetworkConstant };
