/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { SafeAreaView, Text, StatusBar, View, Platform, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import Header from '../../../components/header';
import { useFocusEffect } from '@react-navigation/native';
import { ApiService } from '../../../http/APIService';
import { elevationShadowStyle } from '../../../utils/utils';
import moment from 'moment';
import TouchComponent from '../../../components/touch';

function Index (props) {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  async function fetchData () {
    try {
      setLoading(true);
      const [error, data] = await ApiService.reportList();
      setLoading(false);
      if (!error) {
        setReports(data);
      }
    } catch (e) {
    }
  }

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
        data={reports}
        style={{
          flex: 1,
        }}
        renderItem={renderItem}
        onRefresh={fetchData}
        refreshing={loading}
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
                  width: 80,
                  height: 66,
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

  function renderItem ({ item, index }) {
    return (
      <TouchComponent
        onPress={() => {
          props.navigation.navigate('webview', { userReportId: item.userReportId });
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 15,
            marginHorizontal: 15,
            marginTop: index === 0 ? 15 : 0,
            marginBottom: 15,
            flexDirection: 'row',
            borderRadius: 4,
            alignItems: 'center',
            ...elevationShadowStyle(5)
          }}
        >

          <Image
            source={require('../../../asset/images/icon_my_report_list.png')}
            style={{
              width: 44,
              height: 44,
              flexShrink: 0
            }}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 12,
              height: 44,
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 16
              }}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {item.reportName}
            </Text>
            <Text
              style={{
                color: '#999999'
              }}
            >
              {moment(item.generateTime).format('YYYY-MM-DD')}
            </Text>
          </View>

          <Image
            source={require('../../../asset/images/icon_arrow_right.png')}
            style={{
              width: 7,
              height: 12
            }}
          />

        </View>
      </TouchComponent>
    )
  }
}

function mapStateToProps (state) {
  return state;
}

export default connect(mapStateToProps)(Index);
