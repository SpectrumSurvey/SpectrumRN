/*
 * @Author: middle
 * @Desc: index
 * @Date: 2020/1/5 20:24
 * @Email: middle2021@gmail.com
 */
import React from 'react';
import {Header} from 'react-native-elements';
import PropTypes from 'prop-types';

function header(props) {
  const {color, title, statusBarProps, containerStyle, leftComponent, centerStyle} = props;
  return (
    <Header
      statusBarProps={{
        backgroundColor: color,
        ...statusBarProps,
      }}
      leftComponent={leftComponent}
      containerStyle={{
        backgroundColor: color,
        borderBottomWidth: 0,
        ...containerStyle,
      }}
      centerComponent={{
        text: title,
        style: {
          color: '#fff',
          fontSize: 18,
          ...centerStyle,
        },
      }}
    />
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
};

header.defaultProps = {
  color: '#6769FB',
  back: false,
  title: '',
  statusBarProps: {
    translucent: false,
  },
  leftComponent: null,
  containerStyle: {},
  centerStyle: {}
};

export default header;
