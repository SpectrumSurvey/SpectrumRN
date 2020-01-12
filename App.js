/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import { ActivityIndicator, Image, View, Text } from 'react-native';
import {Provider} from 'react-redux';
import models from './_app/models';
import {navigationRef} from './_app/utils/NavigationService';
import {Provider as AntdProvider} from '@ant-design/react-native';

import {DvaInstance} from './_app/utils/dva';
import {NavigationNativeContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

import Home from './_app/pages/home';
import Msg from './_app/pages/msg';
import Mine from './_app/pages/mine';
import Login from './_app/pages/login';
import Answer from './_app/pages/answer';
import MyReport from './_app/pages/mine/report';
import MyTask from './_app/pages/mine/task';
import {connect} from 'react-redux';

if (__DEV__) {
  require('./_app/utils/network.inspect');
}

const app = DvaInstance.instance;
app.start();
const store = app._store;

// 检查登录状态
store.dispatch({
  type: 'auth/checkLogin',
});

window.__cached_model__ = window.__cached_model__ || {};

models.forEach(model => {
  // 装载models对象
  if (!window.__cached_model__[model.namespace]) {
    app.model(model);
    window.__cached_model__[model.namespace] = 1;
  }
});

/**
 * @return {null}
 */
function StackNavigator(props) {
  const {authStore} = props;

  if (!authStore?.init) {
    // 未初始化完成
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator
          size={'large'}
          style={{
            marginBottom: 16,
          }}
        />
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationNativeContainer ref={navigationRef}>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          headerTintColor: 'white',
          headerShown: false,
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        {!authStore.token ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <React.Fragment>
            <Stack.Screen name="Root" component={renderBottomTab} />
            <Stack.Screen name="Answer" component={Answer} />
            <Stack.Screen name="task" component={MyTask} />
            <Stack.Screen name="report" component={MyReport} />
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

function mapStateToProps(state) {
  return {
    authStore: state.auth,
  };
}

const ConnectStackNavigator = connect(mapStateToProps)(StackNavigator);

const Tabs = createBottomTabNavigator();

const App: () => React$Node = () => {
  useEffect(() => {
    store.dispatch({
      type: 'auth/checkLogin',
    });
  }, []);

  return (
    <Provider store={store}>
      <AntdProvider>
        <ConnectStackNavigator />
      </AntdProvider>
    </Provider>
  );
};

function renderBottomTab() {
  return (
    <Tabs.Navigator
      backBehavior={'none'}
      tabBarOptions={{
        scrollEnabled: true,
        activeTintColor: '#558FFB',
        inactiveTintColor: '#BBBBBB',
        style: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#dddddd',
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name={'首页'}
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./_app/asset/images/tab_home_active.png')
              : require('./_app/asset/images/tab_home.png');
            return <Image style={styles.iconStyle} source={icon} />;
          },
        }}
      />
      <Tabs.Screen
        name={'消息'}
        component={Msg}
        options={{
          tabBarLabel: '消息',
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./_app/asset/images/tab_msg_active.png')
              : require('./_app/asset/images/tab_msg.png');
            return <Image style={styles.iconStyle} source={icon} />;
          },
        }}
      />
      <Tabs.Screen
        name={'mine'}
        component={Mine}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./_app/asset/images/tab_mine_active.png')
              : require('./_app/asset/images/tab_mine.png');
            return <Image style={styles.iconStyle} source={icon} />;
          },
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = {
  iconStyle: {
    width: 20,
    height: 20,
  },
};

export default App;
