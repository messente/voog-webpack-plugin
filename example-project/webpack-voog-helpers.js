const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlCriticalPlugin = require('html-critical-webpack-plugin');

function getLayoutsHtmlWebpackLayoutPluginConfig(layoutList) {
  const htmlWebpackLayouts = [];
  Object.entries(layoutList).forEach(
    ([layoutName, layoutPath]) => htmlWebpackLayouts.push(
      new HtmlWebpackPlugin({
        chunks: ['runtime', 'vendors', layoutName, 'styles'],
        template: `${layoutPath}/${layoutName}.tpl`,
        filename: `./${layoutName}.html`,
        inject: true
      })
    )
  );

  return htmlWebpackLayouts;
}

function getComponentsHtmlWebpackLayoutPluginConfig(componentList) {
  const htmlWebpackComponents = [];
  Object.entries(componentList).forEach(
    ([componentName, componentPath]) => htmlWebpackComponents.push(
      new HtmlWebpackPlugin({
        template: `${componentPath}/${componentName}.tpl`,
        filename: `./components/${componentName}.tpl`,
        inject: false,
      })
    )
  );

  return htmlWebpackComponents;
}

function getCriticalLayoutPluginConfig(layoutList) {
  const criticalLayouts = [];
  Object.keys(layoutList).forEach(
    (layoutName) => criticalLayouts.push(
      new HtmlCriticalPlugin({
        base: path.join(path.resolve(__dirname), 'dist/'),
        src: `./${layoutName}.html`,
        dest: `./layouts/${layoutName}.tpl`,
        inline: true,
        minify: true,
        extract: false,
        width: 1300,
        height: 1200,
        penthouse: {
          blockJSRequests: false,
        }
      })
    )
  );

  return criticalLayouts;
}

module.exports = {
  getLayoutsHtmlWebpackLayoutPluginConfig,
  getComponentsHtmlWebpackLayoutPluginConfig,
  getCriticalLayoutPluginConfig
};
