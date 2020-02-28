/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/2/24 01:37
 * @Email: middle2021@gmail.com
 */
import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../components/header';
import config from '../../../app.json';
import { DvaInstance } from '../../utils/dva';

function WebViewPage (props) {

  const [webUrl, setWebUrl] = useState('');

  useEffect(() => {
    const token = DvaInstance.instance._store.getState().auth.token;
    const { userReportId } = props.route.params || {};
    // userReportId
    const url = `${config.report_url}?userReportId=${userReportId}&token=${encodeURIComponent(token)}`;
    setWebUrl(url)
  },[]);

  return (
    <View
      style={{
        flex: 1,
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
        cacheEnabled={false}
        incognito={true}
        source={{ uri: webUrl }}
      />
    </View>
  );
}

export default WebViewPage;
