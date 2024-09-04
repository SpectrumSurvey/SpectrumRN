/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import {
  SafeAreaView,
  Text,
  ImageBackground,
  StatusBar,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import Header from '../../components/header';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useAppState} from '../../utils/hooks.utils';

const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function Index(props) {
  const [now, setNow] = useState(moment());

  useFocusEffect(
    React.useCallback(() => {
      // 更新当前界面
      setNow(moment());
      StatusBar.setBarStyle('light-content');
      // android
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#558FFB');
    }, []),
  );

  const appState = useAppState();

  useEffect(() => {
    // 更新当前界面
    setNow(moment());
  }, [appState]);

  return (
    <ImageBackground
      style={{
        width: '100%',
        height: 450,
        flex: 1,
      }}
      source={require('../../asset/images/home_bg.png')}>
      <Header
        title={'今日问答'}
        color={'transparent'}
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
        <ScrollView>{renderTop()}</ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );

  function renderTop() {
    return (
      <View>
        <View style={styles.topDate}>
          <Text style={styles.dateTxt}>{now.format('YYYY')}</Text>
          <Text style={styles.dateTxt}>/</Text>
          <Text style={styles.dateTxt}>{now.format('MMMM')}</Text>
          <Text style={styles.dateTxt}>/</Text>
          <Text style={styles.dateTxt}>{WEEKS[now.format('d')]}</Text>
        </View>

        <Text style={styles.day}>{now.format('DD')}</Text>

        <Text style={styles.tips1}>了解自己，认识世界</Text>
        <Text style={styles.tips2}>今日事 今日毕</Text>
      </View>
    );
  }

  function Answer() {
    props.navigation.navigate('Answer');
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = {
  topDate: {
    height: 23,
    backgroundColor: '#ffffff30',
    marginHorizontal: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTxt: {
    fontSize: 15,
    color: 'white',
    marginRight: 16,
  },
  day: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 70,
    color: 'white',
    fontWeight: '700',
  },
  tips1: {
    marginTop: 15,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  tips2: {
    marginTop: 15,
    fontSize: 15,
    color: '#c6d0fa',
    textAlign: 'center',
  },
};

export default connect(mapStateToProps)(Index);
