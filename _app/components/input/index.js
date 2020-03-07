/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/15 01:05
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import { Image, Keyboard, TextInput, View } from 'react-native';

function AnswerInput (props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#dfdfdf',
        height: 44,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
      }}
    >
      <Image
        source={require('../../asset/images/icon_edit.png')}
        style={{
          width: 16,
          height: 15,
        }}
      />
      <TextInput
        style={{
          flex: 1,
          fontSize: 15,
          marginLeft: 8,
          color: '#333333'
        }}
        value={props.value}
        onChangeText={props.onChange}
        placeholderTextColor={'#cbcdd0'}
        placeholder={props.placeholder}
        onSubmitEditing={() => {
          // 键盘隐藏
          Keyboard.dismiss()
        }}
      />
    </View>
  );
}

export default AnswerInput;
