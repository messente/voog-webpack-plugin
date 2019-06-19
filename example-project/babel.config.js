module.exports = function (api) {
  api.cache(true);

  const presets = [
    ['@babel/preset-env', {
      corejs: 3,
      useBuiltIns: 'usage',
      debug: false
    }]
  ];
  const plugins = ['@babel/plugin-transform-classes', 'transform-class-properties'];

  return {
    presets,
    plugins
  };
};
