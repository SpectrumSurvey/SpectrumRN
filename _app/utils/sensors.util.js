/*
 * @Author: middle
 * @Desc: step.util
 * @Date: 2020/1/29 15:22
 * @Email: middle2021@gmail.com
 */
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
// 60秒获取一次
setUpdateIntervalForType(SensorTypes.gyroscope, 1000 * 60);

import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { Platform } from 'react-native';
import { HTTP } from '../http';

export function getAccelerometer () {
  return new Promise((resolve, reject) => {
    const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        console.log({ x, y, z, timestamp });

        // 提交到后台
        HTTP.post('/app-user-terminal-record/reported', {
          x, y, z,
        });

      }
      , error => {
        console.log(error);
      });
    // 取消订阅
    // subscription.unsubscribe()
  });
}

export function getSteps () {

  // Fitness

  if (Platform.OS === 'ios') {
    Fitness.getSteps({
      startDate: moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'),
      endDate: moment().endOf('day').format('YYYY/MM/DD HH:mm:ss'),
    }).then(data => {
      console.log(data);
    }).catch((error) => {
      console.warn(error);
    });
  }

  // Fitness.isAuthorized()
  //   .then((authorized) => {
  //     if (authorized) {
  //       return Fitness.getSteps({
  //         startDate: moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'),
  //         endDate: moment().endOf('day').format('YYYY/MM/DD HH:mm:ss'),
  //       }).then(data => {
  //         console.log(data);
  //       });
  //     } else {
  //       return Promise.reject(authorized);
  //     }
  //   })
  //   .catch((error) => {
  //     console.warn(error);
  //   });

}
