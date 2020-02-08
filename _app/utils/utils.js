/*
 * @Author: middle
 * @Desc: utils
 * @Date: 2020/1/5 23:56
 * @Email: middle2021@gmail.com
 */
import { Toast, Portal } from '@ant-design/react-native';
import { PixelRatio } from 'react-native';

const set = new Set();
const loadingSet = new Set();

export function showToast (msg, duration = 1.5) {
  const key = Toast.info(msg, duration, undefined, true);
  set.add(key);
}

export function showLoopToast () {
  const key = Toast.loading('加载中...', 0, undefined, true);
  loadingSet.add(key);
}

export function hideToast () {
  set.forEach(key => {
    Portal.remove(key);
  });
}

export function hideLoopToast () {
  loadingSet.forEach(key => {
    Portal.remove(key);
  });
}

export function handleCatch (error) {
  // 默认异常
  if (__DEV__) {
    console.debug(error);
  }
}

export function elevationShadowStyle (elevation) {
  return {
    elevation,
    shadowColor: '#00000088',
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

export const px2dp = px => PixelRatio.roundToNearestPixel(px);
