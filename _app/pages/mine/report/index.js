/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { SafeAreaView, Text, StatusBar, View, Platform, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Header from '../../../components/header';

function Index (props) {

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white'
      }}
    >
      <Header
        color={'#4E97FD'}
        back={true}
        backTitle={'我的报告'}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#4E97FD',
        }}
      />
      <FlatList
        data={[]}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                paddingTop: 80,
                alignItems: 'center'
              }}
            >
              <Image
                style={{
                  width: 81,
                  height: 71.5,
                  marginBottom: 20,
                }}
                source={require('../../../asset/images/icon_home_empty.png')}
              />
              <Text
                style={{
                  color: 'gray'
                }}
              >
                您的报告还在制作中，请耐心等待~
              </Text>
            </View>
          );
        }}
      />
    </View>
  );

  function renderItem () {

  }
}

function mapStateToProps (state) {
  return state;
}

export default connect(mapStateToProps)(Index);
