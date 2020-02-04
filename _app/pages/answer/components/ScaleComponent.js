/*
 * @Author: middle
 * @Desc: ScaleComponent
 * @Date: 2020/1/15 02:23
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import TouchComponent from '../../../components/touch';
import { connect } from 'react-redux'

function ScaleComponent (props) {
  return (
    <View
      style={{
        padding: 22.5,
        flex: 1
      }}
    >
      <Text
        style={{
          marginBottom: 16,
          fontSize: 18,
          color: '#54B982'
        }}
      >
        您的选择：{props.options.filter(v => v._checked)[0]?.optionValue}
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
                        width: 15,
                        height: 15.5,
                        borderLeftWidth: 1,
                        borderLeftColor: index ? '#54B982' : '#fff',
                      }}
                    />

                    <View
                      style={{
                        width: 15,
                        height: 15.5,
                        borderTopWidth: 1,
                        borderTopColor: '#54B982',
                        borderLeftWidth: 1,
                        borderLeftColor: index === props.options.length - 1 ? '#fff' :'#54B982',
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
                        height: 31,
                        minWidth: 67,
                        paddingHorizontal: 12,
                        marginLeft: 15,
                        backgroundColor: item._checked ? '#54B982' : '#E5F9EF'
                      }}
                    >
                      <Text
                        style={{
                          lineHeight: 31,
                          textAlign: 'center',
                          fontSize: 17,
                          color: item._checked ? '#fff' : '#54B982'
                        }}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                      >
                        {item.optionValue}
                      </Text>
                    </View>
                  </TouchComponent>
                </View>
                {
                  index !== props.options.length - 1 ? (
                    <View
                      style={{
                        height: 15,
                        width: 1,
                        borderLeftWidth: 1,
                        borderLeftColor: '#54B982'
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
