/*
 * @Author: middle
 * @Desc: process.util.js
 * @Date: 2020/2/17 22:23
 * @Email: middle2021@gmail.com
 */
import { NativeModules } from 'react-native';

const ProcessModule = NativeModules.ProcessModule;

class ProcessUtil {
  static async isPermission () {
    return ProcessModule.isPermission()
  }

  static async getProcessInfo () {
    return ProcessModule.getProcess()
  }

  static requestUsagePermission () {
    ProcessModule.requestUsagePermission()
  }
}

export default ProcessUtil;
