/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { SafeAreaView, View, FlatList, Text, Image } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../components/header';
import { useFocusEffect } from '@react-navigation/native';
import { ApiService } from '../../../http/APIService';
import { elevationShadowStyle } from '../../../utils/utils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from 'moment';

const map = new Map();

// 待开始
map.set(2, {
  tag: {
    backgroundColor: '#58C295',
    color: '#fff',
  },
  txtColor: '#58C295',
  txt: '倒计时(天)',
  progress: {
    percentColor: '#E4E5E6',
    border: '#c0c0c0',
    txtColor: '#c0c0c0',
  },
});

// 进行中
map.set(3, {
  tag: {
    backgroundColor: '#4E97FD',
    color: '#fff',
  },
  txtColor: '#4D97FE',
  txt: '剩余',
  progress: {
    percentColor: '#4E97FD',
    border: '#3573E0',
    txtColor: '#3573E0',
  },
});
// 已结束
map.set(4, {
  tag: {
    backgroundColor: '#E5E5E5',
    color: '#c0c0c0',
  },
  txtColor: '#c6c6c6',
  txt: '历时(天)',
  progress: {
    percentColor: '#F5C639',
    border: '#d0c9c9',
    txtColor: '#e09d0c',
  },
});

function Task (props) {

  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  async function fetchData () {
    try {
      setLoading(true);
      const [error, data] = await ApiService.taskList();
      setLoading(false);
      if (!error) {
        setTask(data);
      }
    } catch (e) {
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        color={'#4E97FD'}
        back={true}
        backTitle={'我的任务'}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#4E97FD',
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <FlatList
          style={{
            marginTop: 14,
          }}
          data={task}
          refreshing={loading}
          onRefresh={fetchData}
          renderItem={renderItem}
          keyExtractor={(item => `${item.taskId}`)}
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

    const style = map.get(item.taskStatus);

    return (
      <View
        style={{
          marginHorizontal: 10,
          backgroundColor: 'white',
          borderRadius: 4,
          paddingTop: 10,
          marginBottom: 15,
          ...elevationShadowStyle(4),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >

          <View
            style={{
              height: 20,
              minWidth: 45,
              marginBottom: 10,
              backgroundColor: style?.tag?.backgroundColor,
              borderTopRightRadius: 22.5,
              borderBottomRightRadius: 22.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: style?.tag?.color,
                fontSize: 12,
              }}
            >
              {item.taskStatusName}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 15,
              flex: 1,
              color: '#000',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {item.taskName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            height: 55,
            marginBottom: 20,
          }}
        >

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}
          >

            <View
              style={{
                width: 65,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start'
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: style?.txtColor,
                  }}
                >
                  {item.duration}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: style?.txtColor,
                    marginTop: 13
                  }}
                >
                  天
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#c6c6c6',
                }}
              >
                {style?.txt}
              </Text>
            </View>

            <View
              style={{
                borderLeftWidth: 0.5,
                borderLeftColor: '#e5e8ee',
                marginTop: 13,
                flexDirection: 'row',
                flex: 1,
              }}
            >

              <View
                style={{
                  paddingLeft: 16,
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000'
                  }}
                >
                  {item.taskQuestionnaireNum}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#c1c5cb'
                  }}
                >
                  问卷总数
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 32,
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000'
                  }}
                >
                  {item.completedNum}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#c1c5cb'
                  }}
                >
                  已完成
                </Text>
              </View>

            </View>

            <Text>

            </Text>

          </View>

          <View
            style={{
              position: 'relative',
              borderWidth: 1,
              borderColor: style?.progress?.border,
              borderRadius: 31.5,
              width: 64,
              height: 64,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AnimatedCircularProgress
              size={62}
              width={31}
              fill={parseInt(item.completePercentage.replace('%'))}
              rotation={0}
              tintColor={style?.progress?.percentColor}
              style={{
                flexShrink: 0,
              }}
            />
            <Text
              style={{
                position: 'absolute',
                fontSize: 14,
                color: style?.progress?.txtColor,
              }}
            >
              {item.taskStatus === 2 ? '未完成' :`${parseInt(item.completePercentage.replace('%'))}%`}
            </Text>
          </View>

        </View>

        <View
          style={{
            height: 33,
            backgroundColor: '#eff0f1',
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderTopWidth: 1,
            borderTopColor: '#e7eaf0',
          }}
        >
          <Image
            style={{
              width: 13,
              height: 13,
            }}
            source={require('../../../asset/images/icon_mine_task_date.png')}
          />

          <Text
            style={{
              fontSize: 15,
              marginLeft: 10,
              color: '#999999',
            }}
          >
            {`${moment(item.taskBeginDay).format('YYYY-MM-DD')}`}
            至
            {`${moment(item.taskEndDay).format('YYYY-MM-DD')}`}
          </Text>

        </View>

      </View>
    );
  }
}

export default Task;
