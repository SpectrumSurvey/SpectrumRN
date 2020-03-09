/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { Text, ImageBackground, View, FlatList, Image, Alert, StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import moment from 'moment';
import { useAppState } from '../../utils/hooks.utils';
import { elevationShadowStyle, handleCatch, showToast } from '../../utils/utils';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useFocusEffect } from '@react-navigation/native';
import { recordState } from '../../utils/record.util';
import { getRunningAppsInfo } from '../../utils/sensors.util';

const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function Index (props) {

  const { appHomeQuestionnaire, monthEn, week, year, day, motto, quotes } = props.info;

  const [now, setNow] = useState(moment());

  useEffect(() => {
    props
      .dispatch({
        type: 'msg/loadData',
      })
      .catch(handleCatch);
  }, []);

  // 记录App状态
  recordState();

  useFocusEffect(
    React.useCallback(() => {

      // eslint-disable-next-line react-hooks/rules-of-hooks
      StatusBar.setBarStyle('light-content');
      // android
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#6769FB');

      // 更新当前界面
      setNow(moment());
      fetchData();
    }, []),
  );

  function fetchData () {
    props
      .dispatch({
        type: 'home/loadData',
      })
      .catch(handleCatch);
  }

  function renderCards () {
    return (
      <FlatList
        style={{
          flex: 1,
          marginTop: 30,
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                height: 169,
                borderRadius: 6,
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: 30,
                backgroundColor: 'white',
                justifyContent: 'center',
                ...elevationShadowStyle(5),
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 66,
                  alignSelf: 'center',
                  marginBottom: 22.5,
                }}
                source={require('../../asset/images/icon_home_empty.png')}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: '#c4c8cd',
                }}
              >
                任务待启动，请耐心等待
              </Text>
            </View>
          );
        }}
        data={appHomeQuestionnaire}
        renderItem={renderItem}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                width: 1,
                height: 19,
              }}
            />
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }

  function renderItem ({ item, index }) {
    // 是否已经完成
    const isEnd = item.userQuestionnaireStatus === 2;

    const extraProps = isEnd ? {
      onPress: () => {
        showToast('该问卷已完成！');
      },
    } : {
      linearGradientProps: {
        colors: ['#499EF3', '#336DF6', '#5346F7'],
        start: { x: 0, y: 0.5 },
        end: { x: 1, y: 0.5 },
      },
      ViewComponent: LinearGradient,
      raised: true,
      onPress: () => {
        props.navigation.navigate('Answer', { ...item });
      },
    };

    return (
      <View
        style={{
          borderRadius: 8,
          paddingHorizontal: 15,
          marginHorizontal: 16,
          paddingTop: 15,
          paddingBottom: 19,
          ...elevationShadowStyle(5),
          backgroundColor: 'white',
          marginBottom: (index === appHomeQuestionnaire.length - 1) ? 15 : 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              {
                isEnd ? (
                  <Text
                    style={{
                      color: '#b7b7b7',
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: '#b7b7b7',
                      paddingHorizontal: 5,
                      paddingVertical: 3,
                      marginRight: 8,
                      flexShrink: 0,
                    }}
                  >
                    已完成
                  </Text>
                ) : null
              }
              <Text
                style={{
                  fontSize: 17,
                  color: '#000000',
                  flex: 1,
                }}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {item.questionnaireName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12.5,
                alignItems: 'center',
              }}
            >
              <Image
                source={
                  isEnd ?
                    require('../../asset/images/icon_question_end.png') :
                    require('../../asset/images/icon_question_num.png')
                }
                style={{ width: 14, height: 14 }}
              />
              <Text style={{ fontSize: 14, color: '#999999', marginHorizontal: 15 }}>题目数</Text>
              <Text style={{ fontSize: 14, color: isEnd ? '#999999' : '#1f1e1e' }}>
                {item.subjectNum ?? ''}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 18,
                alignItems: 'center',
              }}
            >
              <Image
                source={
                  isEnd ?
                    require('../../asset/images/icon_time_end.png') :
                    require('../../asset/images/icon_time.png')
                }
                style={{ width: 14, height: 14 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: '#999999',
                  marginHorizontal: 15,
                }}>
                {isEnd ? '完成于' : '发布于'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isEnd ? '#999999' : '#1f1e1e',
                }}>
                {moment(isEnd ? item.completeTime : item.sendTime).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
          </View>

          {
            !isEnd ? (
              <AnimatedCircularProgress
                size={60}
                width={3}
                lineCap={'round'}
                fill={parseInt(item.completePercentage.replace('%'))}
                rotation={0}
                tintColor="#6257FB"
                style={{
                  flexShrink: 0,
                }}
                backgroundColor="#D7E7FE"
                children={() => {
                  return (
                    <Text
                      style={{
                        fontSize: 17,
                        color: '#6257FB',
                      }}
                    >
                      {parseInt(item.completePercentage.replace('%'))}%
                    </Text>
                  );
                }}
              />
            ) : null
          }

        </View>

        <Button
          title={isEnd ? '该问卷已完成' : '进入答题'}
          containerStyle={{
            marginTop: 18,
          }}
          buttonStyle={{
            backgroundColor: isEnd ? '#e7e7e7' : '#405DF6',
            height: 40,
            borderRadius: 25,
          }}
          titleStyle={{
            fontSize: 17,
            color: isEnd ? '#aeaeae' : '#fff',
          }}
          {...extraProps}
        />

      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
      }}>
      <ImageBackground
        style={{
          width: '100%',
          height: 450,
        }}
        source={require('../../asset/images/home_bg.png')}
      />
      <ImageBackground
        style={{
          width: 200,
          height: 50,
          alignSelf: 'center',
          position: 'absolute',
          bottom: 50,
        }}
        resizeMode={'contain'}
        source={require('../../asset/images/home_logo.png')}
      />

      <View
        style={{
          width: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
        }}>
        <Header
          title={'今日问卷'}
          color={'transparent'}
          statusBarProps={{
            barStyle: 'light-content',
            translucent: true,
            backgroundColor: '#6769FB',
          }}
          titleColor={'#fff'}
          containerStyle={{
            flexShrink: 0,
          }}
        />
        {renderTop()}
        {renderCards()}
      </View>
    </View>
  );

  function renderTop () {
    return (
      <View
        style={{
          flexShrink: 0,
        }}
      >
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
}

function mapStateToProps (state) {
  return {
    info: state?.home?.info,
  };
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
