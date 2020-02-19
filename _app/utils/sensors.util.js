/*
 * @Author: middle
 * @Desc: step.util
 * @Date: 2020/1/29 15:22
 * @Email: middle2021@gmail.com
 */
import { gyroscope } from 'react-native-sensors';
import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { Platform } from 'react-native';
import { HTTP } from '../http';
import ProcessUtil from './process.util';
import { Modal } from '@ant-design/react-native';

export function getAccelerometer () {
  return new Promise((resolve, reject) => {
    const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        resolve({ x, y, z, timestamp });
        try {
          // 取消订阅
          subscription.unsubscribe();
        } catch (e) {
        }
      }
      , error => {
        reject(error);
        try {
          // 取消订阅
          subscription.unsubscribe();
        } catch (e) {
        }
      });
  });
}

export function getSteps () {
  if (Platform.OS === 'ios') {
    return Fitness.getSteps({
      startDate: moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'),
      endDate: moment().endOf('day').format('YYYY/MM/DD HH:mm:ss'),
    });
  } else {
    return Promise.reject(null);
  }
}

export async function getRunningAppsInfo () {
  console.log('getRunningAppsInfo');
  if (Platform.OS === 'android') {
    // 获取进程信息
    try {
      const granted = await ProcessUtil.isPermission();
      if (granted) {
        const infos = await ProcessUtil.getProcessInfo();
        // 数组
        if (!_.isEmpty(infos)) {
          const str = JSON.stringify(infos);

          await HTTP.post('/app-user-terminal-record/reported', {
            processName: str,
            $skipLoading: true,
          });
        }
      } else {
        // 不同意，弹窗提示
        Modal.alert('提示', '打开设置页，授权该应用访问应用使用记录权限', [
          { text: '取消', onPress: () => {}, style: 'cancel' },
          {
            text: '确认', onPress: () => {
              // 打开设置页面
              ProcessUtil.requestUsagePermission();
            },
          }]);
      }
    } catch (e) {
      // 获取进程信息异常
    }
  }
}
