/*
 * @Author: middle
 * @Desc: step.util
 * @Date: 2020/1/29 15:22
 * @Email: middle2021@gmail.com
 */
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
// 60秒获取一次
// setUpdateIntervalForType(SensorTypes.gyroscope, 1000);

import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { Platform } from 'react-native';
import { HTTP } from '../http';

export function getAccelerometer () {
  return new Promise((resolve, reject) => {
    const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        resolve({ x, y, z, timestamp });
      }
      , error => {
        reject(error);
      });
    // 取消订阅
    subscription.unsubscribe();
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
