/*
 * @Author: middle
 * @Desc: DropDownList
 * @Date: 2020/1/15 00:36
 * @Email: middle2021@gmail.com
 */
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';
import TouchComponent from '../../../components/touch';
import { PickerView } from '@ant-design/react-native';
import { Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useImmer } from 'use-immer';
import { showToast } from '../../../utils/utils';

function DropDownList (props) {

  const [show, setShow] = useState(false);

  const [select, setSelect] = useState(null);

  useEffect(() => {
    if (_.isEmpty(props.options)) {
      setSelect(null);
    } else {
      const filters = props.options.filter(v => v._checked);
      if (!_.isEmpty(filters)) {
        setSelect(filters[0].optionId);
      } else {
        setSelect(null);
      }
    }
  }, [props.options]);

  return (
    <View
      style={{
        paddingTop: 30,
        paddingHorizontal: 22.5,
      }}
    >

      <TouchComponent
        onPress={() => {
          setShow(true);
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#dfdfdf',
            height: 44,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}
        >
          <Text
            style={{
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {
              props
                .options
                .filter(v => v._checked)
                .map(v => v.optionValue)
                .join(',')
            }
          </Text>
          <Icon
            name={'down'}
            size={20}
          />
        </View>
      </TouchComponent>
      {
        props.type === 'single' ? (
          <SingleModal
            select={select}
            setSelect={setSelect}
            setShow={setShow}
            show={show}
            options={props.options}
            dispatch={props.dispatch}
          />
        ) : (
          <MultipleModal
            setShow={setShow}
            show={show}
            options={props.options}
            dispatch={props.dispatch}
          />
        )
      }


    </View>
  );
}

function SingleModal (props) {

  const { setShow, select, setSelect, show, options } = props;

  useEffect(() => {
    if (!show) {
      setSelect(null);
    }
  }, [show]);

  useEffect(() => {
    if (!_.isEmpty(options)) {
      if (_.some(options, { _checked: true })) {
        return;
      }
      props.dispatch({
        type: 'answer/updateOptionByDropDownSingle',
        payload: {
          _index: 0,
        },
      });
    }
  }, []);

  return (
    <Modal
      visible={show}
      transparent={true}
      animationType={'fade'}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000077',
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setShow(false)}
        >
          <View
            style={{
              flex: 1,
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            height: 300,
            backgroundColor: 'white',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
          >
            <Button
              type={'clear'}
              titleStyle={{
                color: '#1e1e1e',
              }}
              onPress={() => setShow(false)}
              title={'取消'}
            />
            <Button
              type={'clear'}
              title={'确定'}
              onPress={() => {
                setShow(false);

                props.dispatch({
                  type: 'answer/updateOptionByDropDownSingle',
                  payload: {
                    _index: props.options.findIndex(v => v.optionId === select),
                  },
                });
              }}
            />
          </View>
          <PickerView
            cols={1}
            data={options.map(v => ({ label: v.optionValue, value: v.optionId }))}
            value={[select]}
            itemStyle={{
              color: '#1e1e1e',
              fontSize: 17,
              lineHeight: 30,
            }}
            onChange={value => {
              setSelect(value[0]);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

function MultipleModal (props) {

  const { setShow, show, options } = props;

  const [ids, setIds] = useImmer([]);

  useEffect(() => {
    parseOptions();
  }, [options]);

  useEffect(() => {
    if (!show) {
      setIds(draft => draft = []);
    } else {
      parseOptions();
    }
  }, [show]);

  function parseOptions () {
    if (_.isEmpty(options)) {
      setIds(draft => draft = []);
    } else {
      const filters = options.filter(v => v._checked);
      if (!_.isEmpty(filters)) {
        setIds(draft => {
          filters.forEach(v => {
            draft.push(v.optionId);
          });
        });
      } else {
        setIds(draft => draft = []);
      }
    }
  }

  return (
    <Modal
      visible={show}
      transparent={true}
      animationType={'fade'}
    >


      <View
        style={{
          flex: 1,
          backgroundColor: '#00000077',
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setShow(false)}
        >
          <View
            style={{
              flex: 1,
            }}
          />
        </TouchableWithoutFeedback>

        <View
          style={{
            height: 300,
            backgroundColor: 'white',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
          >
            <Button
              type={'clear'}
              titleStyle={{
                color: '#1e1e1e',
              }}
              onPress={() => setShow(false)}
              title={'取消'}
            />
            <Button
              type={'clear'}
              title={'确定'}
              onPress={() => {

                if (_.isEmpty(ids)) {
                  showToast('请选择选项');
                  return;
                }

                setShow(false);

                props.dispatch({
                  type: 'answer/updateOptionByDropDownMultiple',
                  payload: {
                    ids,
                  },
                });
              }}
            />
          </View>

          <ScrollView>
            {
              options.map(item => {
                return (
                  <TouchComponent
                    onPress={() => onChecked(item)}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 22,
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
                        {item.optionValue}
                      </Text>
                      <CheckBox
                        onPress={() => onChecked(item)}
                        checked={ids.includes(item.optionId)}
                      />
                    </View>
                  </TouchComponent>
                );
              })
            }
          </ScrollView>

        </View>


      </View>

    </Modal>
  );

  function onChecked (item) {
    if (ids.includes(item.optionId)) {
      // 包含
      setIds(draft => {
        const index = draft.findIndex(v => v === item.optionId);
        draft.splice(index, 1);
      });
    } else {
      // 不包含
      setIds(draft => {
        draft.push(item.optionId);
      });
    }
  }
}

DropDownList.propTypes = {
  options: PropTypes.array,
  type: PropTypes.string,
  subjectType: PropTypes.number,
};

export default connect()(DropDownList);
