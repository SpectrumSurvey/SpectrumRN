/*
 * @Author: middle
 * @Desc: process.util.js
 * @Date: 2020/2/17 22:23
 * @Email: middle2021@gmail.com
 */
import { NativeModules, Text } from 'react-native';
import { Modal } from '@ant-design/react-native';
import React from 'react';

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

  static showDialog () {
    // 不同意，弹窗提示
    Modal.alert('提示',
      (
        <Text
          style={{
            textAlign: 'center',
          }}
        >
          打开设置页，授权该应用访问应用使用记录权限
        </Text>
      )
      , [
      { text: '取消', onPress: () => {}, style: 'cancel' },
      {
        text: '确认', onPress: () => {
          // 打开设置页面
          ProcessUtil.requestUsagePermission();
        },
      }]);
  }
}

export default ProcessUtil;
