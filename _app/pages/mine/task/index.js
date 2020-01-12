/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import {SafeAreaView, Text, StatusBar, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import React from 'react';
import Header from '../../../components/header';

function Index(props) {

  return (
    <View style={{flex: 1}}>
      <Header
        color={'#6769FB'}
        back={true}
        backTitle={'我的任务'}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#6769FB',
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <StatusBar backgroundColor={'#6079FB'} />
        <Text>answer</Text>
      </SafeAreaView>
    </View>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Index);
