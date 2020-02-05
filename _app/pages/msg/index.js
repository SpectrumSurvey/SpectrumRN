/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { Alert, FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Header from '../../components/header';
import { HeadLeftTitle } from '../../asset/styles/AppStyle';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { elevationShadowStyle, handleCatch } from '../../utils/utils';

function Msg (props) {

  const { list, loading } = props.msg;

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  function fetchData () {
    props
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
          style={{
            marginBottom: 14,
            marginTop: 14,
          }}
          data={list}
          refreshing={loading}
          renderItem={renderItem}
          onRefresh={fetchData}
          keyExtractor={(item) => `${item.userMessageId}`}
          ListFooterComponent={() => {
            return (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#1e1e1e'
                }}
              >
                没有更多了~
              </Text>
            )
          }}
        />
      </SafeAreaView>
    </View>
  );

  function renderItem ({ item }) {
    return (
      <View
        style={{
          marginHorizontal: 12.5,
          // height: 85.5,
          backgroundColor: 'white',
          marginBottom: 15,
          borderRadius: 4,
          flexDirection: 'row',
          paddingHorizontal: 11,
          paddingVertical: 16,
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
                fontSize: 17,
              }}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {item.messageTypeName}
            </Text>
            <Text
              style={{
                color: '#CACACA',
                fontSize: 14,
                marginLeft: 16,
              }}
            >
              {moment(item.sendTime).format('YYYY.MM.DD HH:mm')}
            </Text>
          </View>

          <Text
            style={{
              color: '#999999',
              fontSize: 16,
              lineHeight: 20,
            }}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          >
            {item.message}
          </Text>
        </View>

      </View>
    );
  }
}

function mapStateToProps (state) {
  return {
    msg: state.msg,
  };
}

export default connect(mapStateToProps)(Msg);
