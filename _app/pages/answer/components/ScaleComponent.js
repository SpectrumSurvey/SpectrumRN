/*
 * @Author: middle
 * @Desc: ScaleComponent
 * @Date: 2020/1/15 02:23
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import TouchComponent from '../../../components/touch';
import { connect } from 'react-redux'

function ScaleComponent (props) {
  return (
    <View
      style={{
        paddingTop: 23,
        paddingHorizontal: 20,
        flex: 1
      }}
    >
      <Text
        style={{
          marginBottom: 22.5,
          fontSize: 15,
          color: '#4ec295'
        }}
      >
        <Text
          style={{
            color: '#a8a8a8',
            fontSize: 15,
          }}
        >
          您的选择：
        </Text>
        {props.options.filter(v => v._checked)[0]?.optionValue}
      </Text>

      <ScrollView>
        {
          props.options.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <View>

                    <View
                      style={{
                        width: 9,
                        height: 15.5,
                        borderLeftWidth: 0.5,
                        borderLeftColor: index ? '#d0d0d0' : '#fff',
                      }}
                    />
                    <View
                      style={{
                        width: 9,
                        height: 15.5,
                        borderTopWidth: 0.5,
                        borderTopColor: '#d0d0d0',
                        borderLeftWidth: 0.5,
                        borderLeftColor: index === props.options.length - 1 ? '#fff' :'#d0d0d0',
                        alignSelf: 'flex-end',
                      }}
                    />

                  </View>
                  <TouchComponent
                    onPress={() => {
                      props.dispatch({
                        type: 'answer/updateOptionsSingle',
                        payload: {
                          _index: index,
                          _checked: true,
                        },
                      })
                    }}
                  >
                    <View
                      style={{
                        height: 31.5,
                        width: 71,
                        marginLeft: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: item._checked ? '#6FC292' : '#E7F8EF'
                      }}
                    >
                      {
                        item._checked ? (
                          <Image
                            style={{
                              width: 14,
                              height: 14,
                            }}
                            source={require('../../../asset/images/icon_check.png')}
                          />
                        ) : (
                          <Text
                            style={{
                              lineHeight: 19,
                              textAlign: 'center',
                              fontSize: 13,
                              color: item._checked ? '#fff' : '#7BBF9B'
                            }}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                          >
                            {
                              item.optionValue
                            }
                          </Text>
                        )
                      }
                    </View>
                  </TouchComponent>
                </View>
                {
                  index !== props.options.length - 1 ? (
                    <View
                      style={{
                        height: 17.5,
                        width: 1,
                        borderLeftWidth: 0.5,
                        borderLeftColor: '#d0d0d0'
                      }}
                    />
                  ) : null
                }
              </View>
            )
          })
        }
      </ScrollView>

    </View>
  );
}

export default connect()(ScaleComponent);
