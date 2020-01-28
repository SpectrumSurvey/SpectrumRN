/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { SafeAreaView, Text, View, ImageBackground, Image } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Header from '../../components/header';
import { HeadLeftTitle } from '../../asset/styles/AppStyle';
import { ListItem, Icon } from 'react-native-elements';
import { handleCatch, px2dp } from '../../utils/utils';
import { useFocusEffect } from '@react-navigation/native';

function Index (props) {

  const { userDetails } = props;

  useFocusEffect(
    React.useCallback(() => {
      props.dispatch({
        type: 'auth/userDetails'
      }).catch(handleCatch)
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header
        color={'white'}
        statusBarProps={{
          barStyle: 'dark-content',
          backgroundColor: 'white',
        }}
        leftComponent={<Text style={HeadLeftTitle}>我的</Text>}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#f2f2f2',
        }}
      >
        <View
          style={{
            paddingTop: px2dp(12),
            paddingBottom: px2dp(12),
          }}>
          <ImageBackground
            style={{
              height: px2dp(170),
              padding: px2dp(30),
            }}
            source={require('../../asset/images/mine_top_bg.png')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon raised name="user" type="font-awesome" color="#517fa4"/>
              <View
                style={{
                  marginLeft: 15,
                }}>
                <Text
                  style={{ marginBottom: 4, fontSize: 12, color: '#bbcbfd' }}>
                  登录码：
                </Text>
                <Text style={{ fontSize: 17, color: '#fff' }}>{userDetails?.loginCode ?? ''}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 25,
              }}
            >

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.questionnaireNum ?? ''}</Text>
                <Text style={styles.txt2}>问卷数量</Text>
              </View>

              <View
                style={styles.line}
              />

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.subjectNum ?? ''}</Text>
                <Text style={styles.txt2}>答题数量</Text>
              </View>

              <View
                style={styles.line}
              />

              <View style={styles.item}>
                <Text style={styles.txt1}>{userDetails?.projectNum ?? ''}</Text>
                <Text style={styles.txt2}>参与任务</Text>
              </View>

            </View>

          </ImageBackground>
        </View>

        <ListItem
          title={'您还可以选择'}
          containerStyle={styles.itemStyle}
          rightTitle={' '}
          bottomDivider
        />

        <ListItem
          title={'我的报告'}
          rightTitle={' '}
          containerStyle={styles.itemStyle}
          leftIcon={(
            <Image
              style={styles.icon}
              source={require('../../asset/images/icon_my_task.png')}
            />
          )}
          bottomDivider
          chevron={{ color: '#878787' }}
          onPress={() => props.navigation.navigate('report')}
        />

        <ListItem
          rightTitle={' '}
          title={'我的任务'}
          containerStyle={styles.itemStyle}
          leftIcon={(
            <Image
              style={styles.icon}
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
          leftIcon={(
            <Image
              style={styles.icon}
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
      type: 'auth/logOut'
    })
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
    marginTop: 3,
    fontSize: 10.5,
  },
  line: {
    borderLeftWidth: 1,
    borderLeftColor: '#779dff',
    height: 16.5,
  },
  icon: {
    width: px2dp(18.5),
    height: px2dp(19),
  },
  itemStyle: {
    height: px2dp(47),
    // borderBottomColor: '#ebebeb'
  },
};

function mapStateToProps (state) {
  return {
    userDetails: state.auth?.userDetails
  };
}

export default connect(mapStateToProps)(Index);
