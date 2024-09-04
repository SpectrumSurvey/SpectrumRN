/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import {connect} from 'react-redux';
import React from 'react';
import Header from '../../components/header';
import { HeadLeftTitle } from '../../asset/styles/AppStyle';
import {useFocusEffect} from '@react-navigation/native';

function Index(props) {

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      // android
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#fff');
    }, []),
  );

  return (
    <View>
      <Header
        title={'消息'}
        color={'white'}
        leftComponent={(
          <Text style={HeadLeftTitle}>消息</Text>
        )}
        statusBarProps={{
          barStyle: 'dark-content',
        }}
      />
      <SafeAreaView>
        <Text>msg</Text>
      </SafeAreaView>
    </View>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Index);
