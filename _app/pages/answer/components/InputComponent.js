/*
 * @Author: middle
 * @Desc: InputComponent
 * @Date: 2020/1/13 23:03
 * @Email: middle2021@gmail.com
 */
import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import { connect } from 'react-redux'

function InputComponent (props) {

  return (
    <View
      style={{
        paddingTop: 46.5,
        paddingHorizontal: 20,
      }}
    >

      <View
        style={{
          borderWidth: 1,
          borderRadius: 2,
          borderColor: '#dfdfdf',
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
        }}
      >
        <Image
          source={require('../../../asset/images/icon_edit.png')}
          style={{
            width: 15,
            height: 15,
          }}
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            marginLeft: 8,
          }}
          value={props.options[0].optionKey}
          onChangeText={value => {
            props.dispatch({
              type: 'answer/updateOptionsByInput',
              payload: value
            });
          }}
          placeholderTextColor={'#dfdfdf'}
          placeholder={'点击输入血型'}
        />
      </View>

    </View>
  );
}

export default connect()(InputComponent);
