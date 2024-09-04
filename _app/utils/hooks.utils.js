/*
 * @Author: middle
 * @Desc: hooks.utils
 * @Date: 2020/1/5 22:06
 * @Email: middle2021@gmail.com
 */
import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const _handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
      }
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [appState]);

  return appState;
}
