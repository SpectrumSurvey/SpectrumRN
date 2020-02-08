/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { SafeAreaView, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Header from '../../components/header';
import { HeadLeftTitle } from '../../asset/styles/AppStyle';
import { ListItem, Icon } from 'react-native-elements';
import { elevationShadowStyle, handleCatch, px2dp } from '../../utils/utils';
import { useFocusEffect } from '@react-navigation/native';

function Index (props) {

  const { userDetails } = props;

  useFocusEffect(
    React.useCallback(() => {
      props.dispatch({
        type: 'auth/userDetails',
      }).catch(handleCatch);
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header
        leftComponent={<Text style={[HeadLeftTitle, { color: 'black' }]}>我的</Text>}
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
          backgroundColor: '#f2f2f2',
        }}
      >
        <View
          style={{
            paddingTop: 12,
            paddingBottom: 16,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              height: 180,
              padding: 15,
              backgroundColor: '#4E97FD',
              justifyContent: 'space-between',
              marginHorizontal: 15,
              borderRadius: 4,
              ...elevationShadowStyle(5),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 41,
                  height: 41,
                }}
                source={require('../../asset/images/icon_mine_user_logo.png')}
              />
              <View
                style={{
                  marginLeft: 13,
                }}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 14,
                    color: '#bdcbfd',
                  }}>
                  登录码：
                </Text>
                <Text style={{
                  fontSize: 17,
                  color: '#fff',
                }}>
                  {userDetails?.loginCode ?? ''}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.questionnaireNum ?? 0}</Text>
                <Text style={styles.txt2}>问卷数量</Text>
              </View>

              <View
                style={styles.line}
              />

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.subjectNum ?? 0}</Text>
                <Text style={styles.txt2}>答题数量</Text>
              </View>

              <View
                style={styles.line}
              />

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.taskNum ?? 0}</Text>
                <Text style={styles.txt2}>参与任务</Text>
              </View>

            </View>

          </View>
        </View>

        <ListItem
          title={'您还可以选择'}
          titleStyle={{
            fontSize: 18,
            color: '#000000',
          }}
          containerStyle={styles.itemStyle}
          rightTitle={' '}
          bottomDivider
        />

        <ListItem
          title={'我的报告'}
          rightTitle={' '}
          titleStyle={{
            marginLeft: -8,
            fontSize: 14,
            color: '#000000'
          }}
          containerStyle={[
            styles.itemStyle,
            {
              borderBottomWidth: 0,
            },
          ]}
          leftIcon={(
            <Image
              style={styles.icon}
              resizeMode={'contain'}
              source={require('../../asset/images/icon_my_task.png')}
            />
          )}
          bottomDivider={false}
          chevron={{ color: '#878787' }}
          onPress={() => props.navigation.navigate('report')}
        />

        <View
          style={{
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              borderBottomColor: '#F3F4F4',
              borderBottomWidth: 1,
              marginLeft: 16,
              marginRight: 16,
              backgroundColor: '#fff',
            }}
          />
        </View>

        <ListItem
          rightTitle={' '}
          title={'我的任务'}
          containerStyle={styles.itemStyle}
          titleStyle={{
            marginLeft: -8,
            fontSize: 14,
            color: '#000000'
          }}
          leftIcon={(
            <Image
              style={styles.icon}
              resizeMode={'contain'}
              source={require('../../asset/images/icon_my_report.png')}
            />
          )}
          chevron={{ color: '#878787' }}
          onPress={() => props.navigation.navigate('task')}
        />

        <View
          style={{
            width: 1,
            height: 15,
          }}
        />

        <ListItem
          title={'退出'}
          rightTitle={' '}
          containerStyle={[
            styles.itemStyle,
          ]}
          titleStyle={{
            marginLeft: -8,
            fontSize: 14,
            color: '#000000'
          }}
          leftIcon={(
            <Image
              style={styles.icon}
              resizeMode={'contain'}
              source={require('../../asset/images/icon_logout.png')}
            />
          )}
          onPress={logout}
          chevron={{ color: '#878787' }}
        />

      </SafeAreaView>
    </View>
  );

  function logout () {
    // 移除登录信息
    props.dispatch({
      type: 'auth/logOut',
    });
  }
}

const styles = {
  item: {
    alignItems: 'center',
    flex: 1,
  },
  txt1: {
    color: 'white',
    fontSize: 17.5,
  },
  txt2: {
    color: 'white',
    marginTop: 8,
    fontSize: 12,
  },
  line: {
    borderLeftWidth: 1,
    borderLeftColor: '#779dff',
    height: 17,
  },
  icon: {
    width: 19.5,
    height: 17,
    marginRight: 0,
  },
  itemStyle: {
    height: 47,
    paddingHorizontal: 20,
    borderBottomColor: '#F3F4F4',
    borderBottomWidth: 1,
  },
};

function mapStateToProps (state) {
  return {
    userDetails: state.auth?.userDetails,
  };
}

export default connect(mapStateToProps)(Index);
