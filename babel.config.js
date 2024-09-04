module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['import', {libraryName: '@ant-design/react-native'}],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
