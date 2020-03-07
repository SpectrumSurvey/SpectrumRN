/*
 * @Author: middle
 * @Desc: ListOptions
 * @Date: 2020/1/12 20:11
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AnswerInput from '../../../components/input';
import TouchComponent from '../../../components/touch';

function ListOptions (props) {

  const { options, type, subjectType } = props;

  const isSingle = type === 'single';

  return (
    <FlatList
      style={{
        paddingHorizontal: 22.5,
        marginTop: 15,
        marginBottom: 15,
        flex: 1,
      }}
      data={options}
      ItemSeparatorComponent={() => {
        return (
          <View style={{ width :1, height: 10}}/>
        )
      }}
      renderItem={renderItem}
      keyExtractor={(item => `${item.optionId}`)}
    />
  );

  function renderItem ({ item, index }) {

    return (
      <TouchComponent
        onPress={() => {

          if (isSingle) {
            props.dispatch({
              type: 'answer/updateOptionsSingle',
              payload: {
                _index: index,
                _checked: true,
              },
            });
          } else {
            props.dispatch({
              type: 'answer/updateOptions',
              payload: {
                _index: index,
                _checked: !item._checked,
              },
            });
          }
        }}
      >
        <View>

          <View
            style={{
              height: 50,
              borderWidth: item._checked ? 0 : 1,
              borderColor: '#d7dce5',
              borderRadius: 8,
              paddingHorizontal: 15,
              justifyContent: 'center',
              backgroundColor: item._checked ? '#54B982' : '#F8F8F8'
            }}
          >
            <Text
              style={{
                color: item._checked ? '#fff' : '#333333',
                fontSize: 15,
              }}
            >
              {`${item.optionKey}、 ${item.optionValue}`}
            </Text>
          </View>
          {
            (item._checked && item.filling) ? (
              <AnswerInput
                placeholder={'请输入'}
                value={item.fillingValue}
                onChange={(value) => {
                  if (isSingle) {
                    props.dispatch({
                      type: 'answer/updateOptionsSingle',
                      payload: {
                        _index: index,
                        _checked: item._checked,
                        fillingValue: value
                      },
                    });
                  } else {
                    props.dispatch({
                      type: 'answer/updateOptions',
                      payload: {
                        _index: index,
                        _checked: item._checked,
                        fillingValue: value
                      },
                    });
                  }
                }}
              />
            ) : null
          }

        </View>
      </TouchComponent>
    )
  }
}

ListOptions.propTypes = {
  options: PropTypes.array,
  type: PropTypes.string,
  subjectType: PropTypes.number,
};

export default connect()(ListOptions);
