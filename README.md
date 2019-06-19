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

## Why use WebPack

Voog custom layouts and code editor is a good way to get your designs up and running fast, but once your site grows 
then the simplicity creates some limitations in how the project is structured, what kind of optimization tools are 
available and how to continue developing the design.

With WebPack and VoogWebpackPlugin you can overcome some of these limitations. For example you could add

0. folder management
1. branch management - develop layouts/components in git branches and deploy all changes with webpack immediately
2. [cache busting](https://webpack.js.org/guides/caching/) to javscript, css, image and font files
3. SASS/CSS/JS minification with webpack
4. [critical CSS](https://github.com/anthonygore/html-critical-webpack-plugin) to your layouts for faster loading
5. babel so you could use ES6 syntax
6. or write TypeScript

... or implement any [webpack plugin](https://webpack.js.org/plugins/).

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

## How to use

The best way to get started is look at the `example-project` in the same github repository.

1. Name your [layouts](https://www.voog.com/developers/markup) `filename-layout.tpl` and 
[components](https://www.voog.com/developers/markup/basics/components) `filename-component.tpl`. The plugin will know 
how to separate these from the file name extensions.

> ℹ️ All files without `-layout.tpl` or `-component.tpl` extension will be ignored.

2. When you start webpack builder then the plugin will download a list of all the files in your Voog server and
keeps it in memory. If you have changed a file in your local editor then the plugin will check if the contents is
different then what was downloaded from Voog and upload a new version. This will make sure that only the files 
that have changed are uploaded.

3. Everything in your webpack build folder will be uploaded to your Voog server. Including layouts, components, 
images,  stylesheets, javascript files, fonts. 

## Known Problems

**1. I'm experiencing slow build speed with larger projects**

This is caused by [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) that handles generation of 
HTML files. The plugin is generating files synchronously and this makes things slow when you have a lot of template 
files. 

HtmlWebpackPlugin version 4 should fix this [issue](https://github.com/jantimon/html-webpack-plugin/issues/724), 
but it's still in beta.

**2. I'm getting `["invalid syntax","Syntax error (line 100): Tag '{%=\"\" unless=\"\" editmode=\"\" %}' 
was not properly terminated with regexp: /\\%\\}/"]` (or similar) exception`**

You have probably used Voog specific tags in HTML element attributes. In some cases Voog markup conflicts 
with HtmlWebpackPlugin. 

This is not allowed: `<div {% unless editmode %}class="active"{% endunless%}>Voog is fun</div>`. Instead use if/else 
statement for the full element

```html
  {% if editmode %}
    <div>Voog is fun</div>
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

## Authors

[Messente](https://github.com/messente/voog-webpack-plugin) - Send SMS messages and PIN codes in over 190 countries

[npm]: https://img.shields.io/npm/v/voog-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/voog-webpack-plugin
[size]: https://packagephobia.now.sh/badge?p=voog-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=voog-webpack-plugin
