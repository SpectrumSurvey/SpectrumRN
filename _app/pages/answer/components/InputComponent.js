/*
 * @Author: middle
 * @Desc: InputComponent
 * @Date: 2020/1/13 23:03
 * @Email: middle2021@gmail.com
 */
import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import { connect } from 'react-redux'
import AnswerInput from '../../../components/input';

function InputComponent (props) {

  return (
    <View
      style={{
        paddingTop: 46.5,
        paddingHorizontal: 20,
      }}
    >

      <AnswerInput
        value={props.options[0].optionKey}
        placeholder={'请输入'}
        onChange={(value) => {
          props.dispatch({
            type: 'answer/updateOptionsByInput',
            payload: value
          });
        }}
      />

    </View>
  );
}

export default connect()(InputComponent);
