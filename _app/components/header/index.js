/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 20:24
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import {Header} from 'react-native-elements';
import {Image, Platform, StatusBar, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import TouchComponent from '../touch';
import {goBack} from '../../utils/NavigationService';

function header(props) {
  const {
    color,
    title,
    statusBarProps,
    containerStyle,
    centerStyle,
    back,
    backTitle,
    ...resetProps
  } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useFocusEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    StatusBar.setBarStyle(statusBarProps.barStyle || 'light-content');
    // android
    Platform.OS === 'android' && StatusBar.setBackgroundColor(statusBarProps.backgroundColor || '#6769FB');
  });

  const centerComponent = back
    ? null
    : {
        text: title,
        style: {
          color: '#fff',
          fontSize: 18,
          ...centerStyle,
        },
      };

  return (
    <Header
      statusBarProps={{
        backgroundColor: color,
        ...statusBarProps,
      }}
      containerStyle={{
        backgroundColor: color,
        borderBottomWidth: 0,
        ...containerStyle,
      }}
      centerComponent={centerComponent}
      leftContainerStyle={{
        marginLeft: 10,
        backgroundColor: 'red',
      }}
      leftComponent={back ? backComponent(backTitle) : null}
      {...resetProps}
    />
  );
}

function backComponent(backTitle) {
  return (
    <TouchComponent onPress={() => goBack()}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 500,
        }}>
        <Image
          style={{
            width: 9.5,
            height: 16,
          }}
          source={require('../../asset/images/icon_back.png')}
        />
        <Text
          style={{
            fontSize: 17,
            color: '#fff',
            marginLeft: 10,
          }}>
          {backTitle || ''}
        </Text>
      </View>
    </TouchComponent>
  );
}

header.propTypes = {
  color: PropTypes.string,
  back: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  statusBarProps: PropTypes.object,
  leftComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
  containerStyle: PropTypes.object,
  centerStyle: PropTypes.object,
  leftContainerStyle: PropTypes.object,
  backTitle: PropTypes.string,
};

header.defaultProps = {
  color: '#6769FB',
  back: false,
  title: '',
  statusBarProps: {
    translucent: false,
  },
  containerStyle: {
    paddingHorizontal: 0,
  },
  centerStyle: {},
  leftContainerStyle: {
    marginLeft: 15,
  },
  backTitle: '',
};

export default header;
