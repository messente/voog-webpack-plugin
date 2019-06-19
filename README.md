<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![size][size]][size-url]

# voog-webpack-plugin

This plugin uses [Voog API](https://www.voog.com/developers/api) to deploy layouts and assets to Voog.

> ℹ️ Usable with `webpack@4`

## Getting Started

To begin, you'll need to install `voog-webpack-plugin`:

```console
$ npm install voog-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const VoogWebpackPlugin = require('voog-webpack-plugin');

module.exports = {
  plugins: [
    new VoogWebpackPlugin({
      voogApiHost: 'YOUR_VOOG_API_HOST',
      voogApiToken: 'YOUR_VOOG_API_TOKEN'
    })
  ],
};
```

And run `webpack` via your preferred method.

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/voog-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/voog-webpack-plugin
[size]: https://packagephobia.now.sh/badge?p=voog-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=voog-webpack-plugin
