/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import {SafeAreaView, Text, StatusBar, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import React from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';

function Index(props) {
  useFocusEffect(
    React.useCallback(() => {
      console.log(props);
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#ecf0f1');
    }, []),
  );

  const routers = useRoute()

  console.log(routers)

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexGrow: 0,
          backgroundColor: '#6079FB',
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
