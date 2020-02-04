/*
 * @Author: middle
 * @Desc: location.util
 * @Date: 2020/1/25 21:42
 * @Email: middle2021@gmail.com
 */
import { PermissionsAndroid, Platform } from 'react-native';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { HTTP } from '../http';

export async function initAMap () {
// 使用自己申请的高德 App Key 进行初始化
  return await init({
    ios: '3f7553990a746a61aa6ce7b3e43d98e0',
    android: 'd9d73033dbb22b4e0664018d5d72facc',
  });
}

export async function getLocation () {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        // 对于 Android 需要自行根据需要申请权限
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      }

      // SABL(true);

      // 获取当前位置
      Geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords || {};

        if (latitude && longitude) {
          resolve(coords);
        } else {
          reject({});
        }
      }, error => {
        reject(error);
      });
    } catch (e) {
      reject(e);
    }
  });

}
