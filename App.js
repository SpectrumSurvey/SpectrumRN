/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StatusBar, Image} from 'react-native';
import {Provider} from 'react-redux';
import models from './_app/models';
import {navigationRef} from './_app/utils/NavigationService';
import {Provider as AntdProvider} from '@ant-design/react-native';

import {DvaInstance} from './_app/utils/dva';
import {NavigationNativeContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import Home from './_app/pages/home';
import Msg from './_app/pages/msg';
import Mine from './_app/pages/mine';
import Login from './_app/pages/login';
import Answer from './_app/pages/answer';

const app = DvaInstance.instance;
app.start();
const store = app._store;

window.__cached_model__ = window.__cached_model__ || {};

models.forEach(model => {
  // 装载models对象
  if (!window.__cached_model__[model.namespace]) {
    app.model(model);
    window.__cached_model__[model.namespace] = 1;
  }
});

const Tabs = createBottomTabNavigator();

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AntdProvider>
        <NavigationNativeContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Login"
            headerMode="screen"
            screenOptions={{
              headerTintColor: 'white',
              headerShown: false,
              headerStyle: {backgroundColor: 'tomato'},
            }}>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: 'Awesome app',
              }}
            />
            <Stack.Screen
              name="Root"
              component={renderBottomTab}
              options={{
                title: 'Root',
              }}
            />
            <Stack.Screen
              name="Answer"
              component={Answer}
              options={{
                title: 'Answer',
              }}
            />
          </Stack.Navigator>
        </NavigationNativeContainer>
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
