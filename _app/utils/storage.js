/*
 * @Author: middle
 * @Desc: storage
 * @Date: 2020/1/11 14:49
 * @Email: middle2021@gmail.com
 */
import AS from '@react-native-community/async-storage';

const AsyncStorage = {
  async getItem(key) {
    let value = await AS.getItem(key);

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },

  async setItem(key, value) {
    let v;

    try {
      v = JSON.stringify(value);
    } catch (e) {
      v = value;
    }

    return AS.setItem(key, v);
  },

  async removeItem(key) {
    return AS.removeItem(key);
  },

};

export { AsyncStorage };
