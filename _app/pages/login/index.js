/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 17:15
 * @Email: middle2021@gmail.com
 */
import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import Header from '../../components/header';
import {Input, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {Toast} from '@ant-design/react-native';
import {connect} from 'react-redux';
import { handleCatch } from '../../utils/utils';

function Index(props) {
  const [code, setCode] = useState('');

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
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <Text style={styles.welcome}>Hi,欢迎加入我们的调查</Text>

        <Text style={styles.welcome2}>请输入您的登录码</Text>

        <View
          style={{
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
              colors: ['#499EF3', '#336DF6', '#5346F7'],
              start: {x: 0, y: 0.5},
              end: {x: 1, y: 0.5},
            }}
            ViewComponent={LinearGradient}
          />
        </View>
      </SafeAreaView>
    </View>
  );

  function onInput(value) {
    setCode(value);
  }

  function go() {
    if (!code) {
      Toast.info('请输入登录码');
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
