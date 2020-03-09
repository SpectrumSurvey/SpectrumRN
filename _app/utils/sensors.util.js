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
import { isLogin } from './record.util';
import _ from 'lodash';

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

export async function getSteps () {
  if (Platform.OS === 'ios') {
    try {
      await Fitness.requestPermissions([{ kind: Fitness.PermissionKind.Steps, access: Fitness.PermissionAccess.Read }]);
      await Fitness.isAuthorized([{ kind: Fitness.PermissionKind.Steps, access: Fitness.PermissionAccess.Read }]);
      const steps = await Fitness.getSteps({
        startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      });
      if (!_.isEmpty(steps)) {
        // 步数不为空
        const { quantity, startDate, endDate } = steps[0];

        await HTTP.post('/app-user-pedometer/reported', {
          pedometer: quantity,
          $skipLoading: true,
        });

      }
    } catch (e) {
      console.warn(e);
    }
  } else {
    return Promise.reject(null);
  }
}

export async function getRunningAppsInfo () {
  if (!isLogin()) {
    return;
  }
  if (Platform.OS === 'android') {
    // 获取进程信息
    try {
      const granted = await ProcessUtil.isPermission();
      if (granted) {
        const infos = await ProcessUtil.getProcessInfo();
        // 数组
        if (!_.isEmpty(infos)) {
          const str = JSON.stringify(infos);

          await HTTP.post('/app-user-process-record/reported', {
            json: str,
            $skipLoading: true,
          });
        }
      } else {
        ProcessUtil.showDialog();
      }
    } catch (e) {
      // 获取进程信息异常
    }
  }
}
