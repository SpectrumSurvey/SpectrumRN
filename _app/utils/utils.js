/*
 * @Author: middle
 * @Desc: utils
 * @Date: 2020/1/5 23:56
 * @Email: middle2021@gmail.com
 */
import { Toast, Portal } from '@ant-design/react-native'
const set = new Set();

export function showToast (msg = '加载中...', duration = 1.5) {
  const key = Toast.loading(msg, duration, undefined, true)
  set.add(key);
}

export function showLoopToast () {
  showToast('加载中...', 0)
}

export function hideToast () {
  set.forEach(key => {
    Portal.remove(key);
  });
}
