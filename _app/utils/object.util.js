/*
 * @Author: middle
 * @Desc: object.util
 * @Date: 2020/1/11 14:17
 * @Email: middle2021@gmail.com
 */
const objectUtil = {
  /**
   * @desc 移除对象中有空值的属性 空值包含 undefined '' null
   * @param object
   */
  dropEmptyValue(object) {
    const keys = Object.keys(object);

    const definedMap = {};

    keys.forEach(key => {
      const value = object[key];
      if (value === undefined || value === '' || value === null) {
        return;
      }

      definedMap[key] = value;
    });

    return definedMap;
  },

  /**
   * @desc 移除对象中有空值和 false 的属性 空值包含 undefined '' null false
   */
  dropEmptyAndFalseValue(object) {
    const keys = Object.keys(object);

    const definedMap = {};

    keys.forEach(key => {
      const value = object[key];
      if (value === undefined || value === '' || value === null || value === false) {
        return;
      }

      definedMap[key] = value;
    });

    return definedMap;
  },
};

export { objectUtil };
