/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 17:15
 * @Email: middle2021@gmail.com
 */
import React, { useEffect, useState } from 'react';
import { Image, Clipboard, Text, TouchableWithoutFeedback, View, Modal as NativeModal, SafeAreaView, ScrollView, Platform } from 'react-native';
import Header from '../../components/header';
import { Input, Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Modal as AntdModal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import { handleCatch, showToast } from '../../utils/utils';
import { AsyncStorage } from '../../utils/storage';
import RNExitApp from 'react-native-exit-app';
import { WebView } from 'react-native-webview';
import htmlStr from '../../utils/text.util';
import { getBottomSpace, getStatusBarHeight } from '../../utils/iphonex.util';

function Index (props) {
  const [code, setCode] = useState('');

  const [modalVisible, setVisible] = useState(false);

  const [permissionVisible, setPermissionVisible] = useState(false);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (permissionVisible) {
      setDisabled(true);
    }
  }, [permissionVisible]);

  useEffect(() => {
    AsyncStorage
      .getItem('isRead')
      .then(res => {
        if (!res) {
          setVisible(true);
        }
      })
      .catch(handleCatch);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Header
        color={'white'}
        statusBarProps={{
          barStyle: 'dark-content',
          translucent: true,
          backgroundColor: 'white',
        }}
      />
      <View
        style={{
          flex: 1,
        }}>
        <Text style={styles.welcome}>Hi,欢迎加入我们的调查</Text>

        <Text style={styles.welcome2}>请输入您的登录码</Text>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}>
          <Input
            placeholder={'请输入登录码'}
            inputContainerStyle={{
              borderBottomColor: '#dddddd',
              marginBottom: 40,
            }}
            leftIcon={{
              type: 'feather',
              name: 'user',
              color: '#558FFB',
            }}
            leftIconContainerStyle={{
              marginLeft: 0,
              marginRight: 8,
            }}
            onChangeText={onInput}
          />

          <Button
            onPress={go}
            title={'登录'}
            raised={true}
            buttonStyle={styles.button}
            linearGradientProps={{
              colors: ['#4F97FD', '#4F97FD', '#4F97FD'],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
            ViewComponent={LinearGradient}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback
            onPress={showDialog}
          >
            <Text
              style={{
                marginBottom: 16,
                color: '#4F97FD',
              }}
            >
              登录遇到问题？
            </Text>
          </TouchableWithoutFeedback>
          <Image
            resizeMode={'stretch'}
            style={{
              width: '100%',
              height: 69,
            }}
            source={require('../../asset/images/icon_login_bottom.png')}
          />

        </View>
      </View>
      {
        renderModal()
      }
      {
        renderPermissionModal()
      }
    </View>
  );

  function renderModal () {
    return (
      <AntdModal
        visible={modalVisible}
        footer={[
          { text: '不同意', onPress: () => RNExitApp.exitApp() },
          { text: '同意并继续', onPress: () => setPermissionVisible(true) },
        ]}
        maskClosable={false}
        closable={false}
        transparent
        onClose={() => {}}
      >
        <View>
          <Text>
            <Text> </Text>
            欢迎您使用张江国际脑库App！在您使用我们的服务前，请您阅读
            <TouchableWithoutFeedback
              onPress={() => {
                setPermissionVisible(true);
              }}
            >
              <Text
                style={{
                  color: 'blue',
                }}
              >
                《知情同意书》
              </Text>
            </TouchableWithoutFeedback>
            中的所有条款。请您务必审慎阅读、充分理解
            <TouchableWithoutFeedback
              onPress={() => {
                setPermissionVisible(true);
              }}
            >
              <Text
                style={{
                  color: 'blue',
                }}
              >
                《知情同意书》
              </Text>
            </TouchableWithoutFeedback>
            中的各条款内容。您同意并接受全部条款后再开始使用我们的服务。
          </Text>
        </View>
      </AntdModal>
    );
  }

  function renderPermissionModal () {

    return (
      <NativeModal
        transparent={false}
        animationType={'fade'}
        visible={permissionVisible}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
            paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 0,
          }}
        >
          <WebView
            javaScriptEnabled={true}
            scalesPageToFit={false}
            style={{
              flex: 1,
            }}
            onScroll={e => {
              const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
              const contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
              const oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

              if (parseInt(offsetY + oriageScrollHeight) >= parseInt(contentSizeHeight)) {
                setDisabled(false);
              } else {
                // setDisabled(true);
              }

            }}
            source={{ html: htmlStr }}
          />
          <Button
            title={'下一步'}
            disabled={disabled}
            onPress={() => {
              setVisible(false)
              setPermissionVisible(false);
              // 设置为完成状态
              AsyncStorage.setItem('isRead', '1').catch(handleCatch)
            }}
          />
        </View>
      </NativeModal>
    );
  }

  function showDialog () {
    AntdModal.alert('', (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text>请添加客服微信：</Text>
          <TouchableWithoutFeedback
            onLongPress={() => {
              Clipboard.setString('ZIB-UNISTU');
              showToast('已复制到剪切板~');
            }}
          >
            <Text
              style={{
                color: '#4F97FD',
              }}
            >
              ZIB-UNISTU
            </Text>
          </TouchableWithoutFeedback>
        </View>
      ), [
        { text: '取消', onPress: () => {}, style: 'cancel' },
      ],
    );
  }

  function onInput (value) {
    setCode(value);
  }

  function go () {
    if (!code) {
      showToast('请输入登录码');
      return;
    }
    props
      .dispatch({
        type: 'auth/login',
        payload: {
          loginCode: code,
        },
      })
      .catch(handleCatch);
  }
}

const styles = {
  welcome: {
    fontSize: 25,
    marginTop: 30,
    textAlign: 'center',
  },
  welcome2: {
    fontSize: 20,
    marginTop: 30,
    color: '#d9d9d9',
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#405DF6',
    height: 50,
    borderRadius: 25,
  },
};

export default connect()(Index);
