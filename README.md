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

## Known Problems

**1. I'm experiencing slow build speed with larger projects**

This is caused by [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) that handles generation of 
HTML files. The plugin is generating files synchronously and this makes things slow when you have a lot of template 
files. 

HtmlWebpackPlugin version 4 should fix this [issue](https://github.com/jantimon/html-webpack-plugin/issues/724), 
but it's still in beta.

**2. I'm getting `` exception`**

This is probably caused by using Voog specific tags in HTML elements attributes. Voog markup conflicts with 
HtmlWebpackPlugin. 

This is not allowed: `<div class="{% unless editmode %}active{% endunless%}">Voog is fun</div>`. Instead use if/else 
statement for the full element

```html
  {% if editmode %}
    <div class="">Voog is fun</div>
  {% else %}
    <div class="active">Voog is fun</div>
  {% endif %}
```

An alternative would be to assign class to Voog variable and use it inside the element attribute:

```html
{% if editmode %}
  {% assign cssClass = 'active' %}
{% else %}
  {% assign cssClass = 'not-active' %}
{% endif %}

<div class="{{ cssClass }}}">Voog is fun</div>
```



## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/voog-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/voog-webpack-plugin
[size]: https://packagephobia.now.sh/badge?p=voog-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=voog-webpack-plugin
