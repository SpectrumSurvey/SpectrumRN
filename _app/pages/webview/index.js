/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/2/24 01:37
 * @Email: middle2021@gmail.com
 */
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import config from '../../../app.json';
import { DvaInstance } from '../../utils/dva';
import { hideLoopToast, showLoopToast } from '../../utils/utils';
import Icon from 'react-native-vector-icons/AntDesign';
import { getStatusBarHeight } from '../../utils/iphonex.util';
import { goBack } from '../../utils/NavigationService';

function WebViewPage (props) {

  const [webUrl, setWebUrl] = useState('');

  useEffect(() => {
    StatusBar.setHidden(true, 'slide');
    const token = DvaInstance.instance._store.getState().auth.token;
    const { userReportId } = props.route.params || {};
    // userReportId
    const url = `${config.report_url}?userReportId=${userReportId}&token=${encodeURIComponent(token)}`;
    setWebUrl(url);

    return () => {
      StatusBar.setHidden(false, 'slide');
      hideLoopToast()
    }
  },[]);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative'
      }}
    >
      <StatusBar
        barStyle={'light-content'}
        translucent={true}
        backgroundColor={'#4E97FD'}
      />
      <WebView
        javaScriptEnabled={true}
        scalesPageToFit={false}
        style={{
          flex: 1,
        }}
        onLoadEnd={(event) => {
          hideLoopToast()
        }}
        onLoadStart={(event) => {
          showLoopToast()
        }}
        cacheEnabled={false}
        incognito={true}
        source={{ uri: webUrl }}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 16,
          top: 32
        }}
        activeOpacity={0.7}
        onPress={() => {
          goBack()
        }}
      >
        <Icon
          name={'close'}
          size={22}
          color={'white'}
        />
      </TouchableOpacity>

    </View>
  );
}

export default WebViewPage;
