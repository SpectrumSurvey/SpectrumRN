/*
 * @Author: middle
 * @Desc: touch
 * @Date: 2020/1/8 01:47
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

function TouchComponent (props) {
  const { children, ...reset} = props;
  return Platform.select({
    android: (
      <TouchableNativeFeedback {...reset}>
        {children}
      </TouchableNativeFeedback>
    ),
    ios: (
      <TouchableOpacity
        activeOpacity={0.7}
        {...reset}
      >
        {children}
      </TouchableOpacity>
    )
  });
}

export default TouchComponent;
