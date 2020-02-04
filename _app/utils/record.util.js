/*
 * @Author: middle
 * @Desc: record.util
 * @Date: 2020/2/4 11:35
 * @Email: middle2021@gmail.com
 */
import { useAppState } from './hooks.utils';
import { useEffect, useRef, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { Platform } from 'react-native';
import { getLocation, initAMap } from './location.util';
import { HTTP } from '../http';
import { getAccelerometer, getSteps } from './sensors.util';
import { DvaInstance } from './dva';

const DEFAULT_TIME_OUT = 60000;

export function recordState () {

  const intervalIds = useRef([]);

  const started = useRef(false);

  useEffect(() => {

    return () => {
      // 清除所有定时器

      intervalIds.current.forEach(v => {
        try {
          // 清除定时器
          BackgroundTimer.clearInterval(v);
          clearInterval(v);
        } catch (e) {
        }
      });

      intervalIds.current = [];

      BackgroundTimer.stopBackgroundTimer();
      Platform.OS === 'ios' && BackgroundTimer.stop();

    };

  }, []);

  const appState = useAppState();

  useEffect(() => {

    if (appState === 'active') {
      // 前台状态，停止所有后台定时器
      // 启动interval定时获取

      started.current = false;
      intervalIds.current.forEach(v => {
        // 清除定时器
        BackgroundTimer.clearInterval(v);
      });
      intervalIds.current = [];
      BackgroundTimer.stopBackgroundTimer();
      Platform.OS === 'ios' && BackgroundTimer.stop();

      startInterval(intervalIds, setInterval);

    } else {
      if (started.current) {
        return;
      }

      intervalIds.current.forEach(v => {
        // 清除定时器
        clearInterval(v);
      });
      intervalIds.current = [];

      started.current = true;
      Platform.OS === 'ios' && BackgroundTimer.start();

      const dict = DvaInstance?.instance?._store?.getState()?.auth?.appDict;

      // 定位
      const locationId = BackgroundTimer.setInterval(_recordLocation, dict.LocationFrequency || DEFAULT_TIME_OUT);
      // 陀螺仪
      const accelerometerId = BackgroundTimer.setInterval(_recordAccelerometer, dict.GyroscopeFrequency || DEFAULT_TIME_OUT);
      // 步数
      const stepId = BackgroundTimer.setInterval(_recordSteps, dict.PedometerFrequency || DEFAULT_TIME_OUT);

      intervalIds.current.push(locationId);
      intervalIds.current.push(stepId);
      intervalIds.current.push(accelerometerId);
    }
  }, [appState]);
}

function startInterval (intervalIds, _setInterval) {
  const dict = DvaInstance?.instance?._store?.getState()?.auth?.appDict;
  // 定位
  const locationId = _setInterval(_recordLocation, dict.LocationFrequency || DEFAULT_TIME_OUT);
  // 陀螺仪
  const accelerometerId = _setInterval(_recordAccelerometer, dict.GyroscopeFrequency || DEFAULT_TIME_OUT);
  // 步数
  const stepId = _setInterval(_recordSteps, dict.PedometerFrequency || DEFAULT_TIME_OUT);

  intervalIds.current.push(locationId);
  intervalIds.current.push(stepId);
  intervalIds.current.push(accelerometerId);
}

// 定位
function _recordLocation () {
  // 定位
  initAMap()
    .then(getLocation)
    .then(res => {
      const { latitude, longitude } = res;
      HTTP.post('/app-user-terminal-record/reported', {
        latitude, longitude,
        $skipLoading: true,
      });
    })
    .catch(error => {
      console.log(error);
    });
}

function _recordAccelerometer () {
  getAccelerometer()
    .then(res => {
      const { x, y, z } = res;
      // 提交到后台
      HTTP.post('/app-user-terminal-record/reported', {
        x, y, z,
        $skipLoading: true,
      });
    })
    .catch(e => {

    });
}

function _recordSteps () {
  getSteps()
    .then(res => {
      // 上传到后台
    })
    .catch(err => {

    });
}
