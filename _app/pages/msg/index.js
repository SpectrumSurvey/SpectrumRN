/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { FlatList, Image, Platform, SafeAreaView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Header from '../../components/header';
import { HeadLeftTitle } from '../../asset/styles/AppStyle';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { elevationShadowStyle, handleCatch, showToast } from '../../utils/utils';
import { ApiService } from '../../http/APIService';
import _ from 'lodash';
import TouchComponent from '../../components/touch';
import JPush from 'jpush-react-native';

function Msg (props) {

  const { list, loading } = props.msg;

  useFocusEffect(
    React.useCallback(() => {
      (
        async () => {
          try {
            const _msgList = await fetchData();

            if (_.isEmpty(_msgList)) {
              return;
            }
            // 重置为已读
            await ApiService.readMsg({
              userMessageIds: _msgList.filter(v => v.userMessageId).map(v => v.userMessageId).join(','),
            })
              .then((res) => {
                const [error, resp] = res;
                if (!error) {
                  if (Platform.OS === 'ios') {
                    // 所有重置为已读
                    JPush.setBadge({
                      badge: 0,
                      appBadge: 0
                    });
                  }
                  props
                    .dispatch({
                      type: 'msg/updateMsgRead',
                    });
                }
              });
          } catch (e) {
          }
        }
      )();
    }, []),
  );

  async function fetchData () {
    return props
      .dispatch({
        type: 'msg/loadData',
      })
      .catch(handleCatch);
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header
        leftComponent={(<Text style={HeadLeftTitle}>消息</Text>)}
        color={'#4E97FD'}
        back={true}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#4E97FD',
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={list}
          refreshing={loading}
          renderItem={renderItem}
          onRefresh={fetchData}
          keyExtractor={(item) => `${item.userMessageId}`}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 80
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
                  亲，您当前没有新消息哦~
                </Text>
              </View>
            );
          }}
          ListFooterComponent={() => {
            if (!list.length) {
              return null;
            }
            return (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#999999',
                  marginBottom: 14,
                }}
              >
                没有更多了~
              </Text>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );

  function renderItem ({ item, index }) {
    return (
      <TouchComponent
        onPress={() => {
          if (item.messageType === 2) {
            // 报告
            props.navigation.navigate('webview', { ...item?.extension });
          } else {
            // 问卷消息
            if (item?.extension?.userQuestionnaireStatus !== 2) {
              // 答题
              props.navigation.navigate('Answer', { ...item?.extension });
            } else {
              showToast('该问卷已完成~');
            }
          }
        }}
      >
        <View
          style={{
            marginHorizontal: 12.5,
            backgroundColor: 'white',
            marginBottom: 15,
            borderRadius: 4,
            flexDirection: 'row',
            paddingHorizontal: 11,
            paddingTop: 17,
            paddingBottom: 16,
            marginTop: index === 0 ? 14 : 0,
            ...elevationShadowStyle(3),
          }}
        >
          <Image
            source={item.messageType === 2 ?
              require('../../asset/images/icon_msg_report.png') :
              require('../../asset/images/icon_msg_img1.png')}
            style={{
              width: 44,
              height: 44,
            }}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 15,
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: '#000000'
                }}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {
                  item.messageType === 2 ? '报告消息' : '问卷消息'
                }
              </Text>
              <Text
                style={{
                  color: '#CACACA',
                  fontSize: 10,
                  marginRight: 13,
                }}
              >
                {moment(item.sendTime).format('YYYY.MM.DD HH:mm')}
              </Text>
            </View>

            <Text
              style={{
                color: '#999999',
                fontSize: 13,
                lineHeight: 19,
              }}
              numberOfLines={2}
              ellipsizeMode={'tail'}
            >
              {item.message}
            </Text>
          </View>
        </View>
      </TouchComponent>
    );
  }
}

function mapStateToProps (state) {
  return {
    msg: state.msg,
  };
}

export default connect(mapStateToProps)(Msg);
