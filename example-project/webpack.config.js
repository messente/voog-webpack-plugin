const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VoogWebpackPlugin = require('voog-webpack-plugin');
const webpackConfig = require('./.config');
const {
  getLayoutsHtmlWebpackLayoutPluginConfig,
  getComponentsHtmlWebpackLayoutPluginConfig,
  getCriticalLayoutPluginConfig
} = require('./webpack-voog-helpers');

const voogConfig = process.argv.includes('--prod') ? webpackConfig.voogApi.prod : webpackConfig.voogApi.dev;

const layoutList = {
  'home-layout': './src/pages/home',
  'contact-layout': './src/pages/contact'
};
const componentList = {
  'footer-component': './src/voog-components'
};

const entries = Object.assign(...Object.entries(layoutList).map(
  ([layoutName, layoutPath]) => ({ [layoutName]: `${layoutPath}/${layoutName}.js` })));

module.exports = {
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
      '@styles': path.resolve(__dirname, 'src/sass/'),
      '@images': path.resolve(__dirname, 'src/images/'),
    }
  },
  stats: 'minimal',
  entry: { ...entries },
  output: {
    filename: 'javascripts/[name].js?[contenthash]',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          chunks: 'all',
          enforce: true
        },
      }
    },
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [].concat(
    getLayoutsHtmlWebpackLayoutPluginConfig(layoutList),
    getComponentsHtmlWebpackLayoutPluginConfig(componentList),
    [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['*.html'],
      }),
      new MiniCssExtractPlugin({
        filename: 'stylesheets/[name].[contenthash].css',
      }),
      new webpack.HashedModuleIdsPlugin()
    ],
    getCriticalLayoutPluginConfig(layoutList), [
      new VoogWebpackPlugin({
        voogApiHost: voogConfig.host,
        voogApiToken: voogConfig.apiToken
      })
    ]
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\//],
        use: {
          loader: "babel-loader",
        }
      }, {
        test: /\.(s?css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/'
            }
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets'
            }
          }
        ]
      }, {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      }, {
      test: /\.(tpl)$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      }
    ]
  }
};
