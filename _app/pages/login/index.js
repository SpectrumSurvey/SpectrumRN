/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 17:15
 * @Email: middle2021@gmail.com
 */
import React, { useEffect, useState } from 'react';
import { Image, Clipboard, Text, TouchableWithoutFeedback, View, Modal as NativeModal, Platform } from 'react-native';
import Header from '../../components/header';
import { Input, Button } from 'react-native-elements';
import { Modal as AntdModal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import { elevationShadowStyle, handleCatch, showToast } from '../../utils/utils';
import { AsyncStorage } from '../../utils/storage';
import RNExitApp from 'react-native-exit-app';
import { WebView } from 'react-native-webview';
import htmlStr, { permissionHtml } from '../../utils/text.util';
import { getBottomSpace, getStatusBarHeight } from '../../utils/iphonex.util';
import TouchComponent from '../../components/touch';
import { set } from 'react-native-reanimated';

function Index (props) {
  const [code, setCode] = useState('');

  const [modalVisible, setVisible] = useState(false);

  const [permissionVisible, setPermissionVisible] = useState(false);
  const [permissionVisible1, setPermissionVisible1] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [disabled1, setDisabled1] = useState(true);

  useEffect(() => {
    if (permissionVisible) {
      setDisabled(true);
    }

    if (permissionVisible1) {
      setDisabled1(true)
    }
  }, [permissionVisible, permissionVisible1]);

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

        <View
          style={{
            alignItems: 'center',
            marginBottom: 108,
          }}
        >
          <Text
            style={{
              fontSize: 22.5,
              color: '#000000',
            }}
          >
            <Text
              style={{
                fontSize: 27.5,
                color: '#000000',
                textAlign: 'left',
                width: '100%',
              }}
            >
              Hi~{'\n'}
            </Text>
            欢迎加入我们的调查
          </Text>
        </View>

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
            inputStyle={{
              fontSize: 15,
              color: '#333333',
            }}
            placeholderTextColor={'#d4d4d4'}
            leftIcon={(
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../../asset/images/icon_login_input.png')}
              />
            )}
            leftIconContainerStyle={{
              marginLeft: 0,
              marginRight: 8,
            }}
            onChangeText={onInput}
          />

          <TouchComponent
            onPress={go}
            disabled={!code.length}
          >
            <View
              style={{
                height: 47,
                borderRadius: 23.5,
                backgroundColor: !code.length ? '#d4d6da' : '#4F97FD',
                alignItems: 'center',
                justifyContent: 'center',
                ...elevationShadowStyle(5),
              }}
            >
              <Text
                style={{
                  color: '#fefefe',
                  fontSize: 17,
                }}
              >
                登录
              </Text>
            </View>
          </TouchComponent>

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
        modalVisible && renderModal()
      }
      {
        renderPermissionModal()
      }
      {
        // renderUserPermissionModal()
      }
    </View>
  );

  function renderModal () {
    return (
      <AntdModal
        visible={true}
        bodyStyle={{
          marginTop: 12,
        }}
        footer={[
          { text: '不同意', onPress: () => RNExitApp.exitApp() },
          { text: '同意并继续', onPress: () => setPermissionVisible(true) },
        ]}
        title={'温馨提示'}
        maskClosable={false}
        closable={false}
        transparent
        onClose={() => {}}
      >
        <View>
          <Text
            style={{
              lineHeight: 28,
              fontSize: 16,
            }}
          >
            &emsp;&emsp;欢迎您使用张江国际脑库App！在您使用我们的服务前，请您阅读
            <TouchableWithoutFeedback
              onPress={() => {
                setPermissionVisible1(true);
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
            中的所有条款。请您务必审慎阅读、充分理解《知情同意书》中的各条款内容。您同意并接受全部条款后再开始使用我们的服务。
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
              setVisible(false);
              setPermissionVisible(false);
              // 设置为完成状态
              AsyncStorage.setItem('isRead', '1').catch(handleCatch);
            }}
          />
        </View>
      </NativeModal>
    );
  }

  function renderUserPermissionModal () {

    return (
      <NativeModal
        transparent={false}
        animationType={'fade'}
        visible={permissionVisible1}
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
                setDisabled1(false);
              }

            }}
            source={{ html: permissionHtml }}
          />
          <Button
            title={'完成'}
            disabled={disabled1}
            onPress={() => {
              setPermissionVisible1(false);
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
    height: 47,
    borderRadius: 23.5,
  },
};

export default connect()(Index);
