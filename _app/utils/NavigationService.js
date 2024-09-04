/*
 * @Author: middle
 * @Desc: NavigationService
 * @Date: 2020/1/5 17:38
 * @Email: middle2021@gmail.com
 */
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate (name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}
