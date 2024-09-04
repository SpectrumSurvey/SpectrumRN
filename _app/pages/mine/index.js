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
        title={'我的'}
        color={'white'}
        statusBarProps={{
          barStyle: 'dark-content',
        }}
        leftComponent={(
          <Text style={HeadLeftTitle}>我的</Text>
        )}
      />
      <SafeAreaView>
        <Text>mine</Text>
      </SafeAreaView>
    </View>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Index);
