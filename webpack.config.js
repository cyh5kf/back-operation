'use strict';

var webpack             = require('webpack'),
    HtmlWebpackPlugin   = require('html-webpack-plugin'),
    path                = require('path'),
    fs                  = require('fs'),
    staticResourcePath  = path.join(__dirname, 'static'),
    srcPath             = path.join(__dirname, 'src'),
    nodeModulesPath     = path.join(__dirname, 'node_modules');

var TransferWebpackPlugin = require('transfer-webpack-plugin');


/**
 *  检测Webpack 编译命令中是否带有 NODE_ENV=production 参数
 带有 NODE_ENV=production 参数，意为：处于 发布环境 的编译；
 不带有 NODE_ENV=production 参数，意为：处于 测试环境 的编译。
 *  @author James lv
 *  @creatdate 2015-10-28T14:41:59+0800
 *  @return    {Boolean} true : 发布环境
 false: 测试环境
 */
var isProduction = function () {
  var env =  process.env.NODE_ENV || "";
  env = env.trim();
  return env=='production';
};

/**
 *  检查本地是否有 webpack.localconfig.js 文件
 *  @author James lv
 *  @creatdate 2015-10-28T16:46:58+0800
 *  @return    {Boolean} true : 存在webpack.localconfig.js 文件
 false: 不存在webpack.localconfig.js 文件
 */
var isExistsLocalconfig = function () {
  return fs.existsSync(path.join(__dirname, 'webpack.localconfig.js'));
};

/**
 *  Project config
 检查本地是否有 webpack.localconfig.js 文件，如果有，则使用localconfig 中的配置；
 否则，则使用默认配置。
 *  @type {Object}
 */
var Config = isExistsLocalconfig() ?
    require(path.join(__dirname, 'webpack.localconfig.js'))
    : {
  AjaxDomain: 'mobile.' + 'tonghs.me'//'angelcrunch.com'// tonghs.me
};

/**
 *  自定义环境变量plugin
 *  @type {
 *        __DEV__:      在module 中确定当前是否是测试环境；
                        一般使用 [if(__DEV__) foo();] 的方式调用；
                        在编译时，值为false 的无效if 语句，将被uglify插件擦除。
 *        __AjaxDomain: 在module 中确定当前环境的Ajax 路径；
                        使用 ［var Domain = __AjaxDomain;］ 的方式调用。
 *  }
 */
var defineStatePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(isProduction() ? 'false' : 'true')),
  __AjaxDomain: JSON.stringify(Config.AjaxDomain)
});

/**
 *  指定多个库的min package 路径；
 在 发布环境 中，使用这些官方的发布环境库会去除掉 Warning 模块，
 减小编译后的bundle 体积。（当前会减小40-60KB）
 *  @type {Object}
 */
var modulePath = { // production
      React                       : path.join(nodeModulesPath, 'react/dist/react.min.js'),
      React_addons                : path.join(nodeModulesPath, 'react/dist/react-with-addons.min.js'),
      React_Router                : path.join(nodeModulesPath, 'react-router/umd/ReactRouter.min.js')
    },

    moduleAlias = {
      // static resources
      'static'                      : staticResourcePath
    },

    noParse =  [];


var ExtractTextPlugin = require("extract-text-webpack-plugin");
/**
 *  Webpack compilation config
 *  @author James lv
 *  @creatdate 2015-10-28T14:59:40+0800
 *  @type {Object}
 */

var targetEnv = {
  aliyundebug:'https://servicex.somaapp.com',
  softlayerdebug:"https://www.somapcs.com",
  alitest:'http://123.57.22.248',
  debug239:'http://192.168.7.239:19090',
  localhostdebug:'http://localhost:8080',
}


module.exports = {
  target: 'web',
  cache: true,
  entry: {
    module  : path.join(srcPath, 'index.js')
  },
  /**
   *  Webpack 解析bundle 中请求的module 路径时的设置
   *  @type {Object}
   */
  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src'],
    alias: moduleAlias
  },
  /**
   *  Webpack bundle 的输出设置
   详情见于 https://webpack.github.io/docs/configuration.html#output-chunkfilename
   *  @type {Object}
   */
  output: {
    path: path.join(__dirname, 'tmp'),
    publicPath: '/',
    filename: 'app/[name].[hash].js',
    library: ['Example', '[name]'],
    pathInfo: true
  },

  /**
   *  Webpack loaders
   *  @type {Object}
   */
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory' },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      {
        test: /\.less?$/,
        loaders : [
          'style-loader',
          'css-loader',
          'less-loader?{"sourceMap":true}'
        ],
        include: __dirname
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader?sourceMap",
          {
            publicPath: "../"
          }
      ) },
      { test: /\.(jpg|png|gif)$/, loader: 'url?limit=100000' },
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    ],
    noParse: noParse
  },
  /**
   *  Config to node-sass
   *  @type {Object}
   */
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./static")]
  },

  externals: {
    "jquery": "window.jQuery",
    "jQuery": "window.jQuery",
    "$": "window.jQuery",
    "react": "window.React",
    "ReactDOM": "window.ReactDOM",
    "react-dom": "window.ReactDOM",
    "react-router": "window.ReactRouter",
    "history": "window.History",
    "lodash": "window._",
    "_": "window._",
    "underscore": "window._",
    "audiojs":"window.audiojs"
  },
  plugins: [

    //把指定文件夹下的文件复制到指定的目录
    new TransferWebpackPlugin([{from: 'static',to:'static'}]),

    /**
     *  将bundle 注入到html 文件上的plugin
     *  @type {Object}
     */
    new HtmlWebpackPlugin({
      inject: true,
      excludeChunks: ['test'],
      template: process.env.ENTRY_HTML || 'index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      compress: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin(),
    /**
     *  调用自定义环境变量plugin
     */
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new ExtractTextPlugin("css/[hash]-[chunkhash]-[contenthash]-[name].css", {
      disable: false,
      allChunks: true
    }),
    defineStatePlugin
  ],
  debug: isProduction() ? false : true,
  devtool: isProduction() ? ''
      : 'eval-cheap-module-source-map',
  devServer: {
    port: 6060,
    host:"0.0.0.0",
    contentBase: './',
    historyApiFallback: true,
    proxy: {
      '/api/v1/*': {
        //  target: 'http://123.57.22.248',
        // target: 'http://192.168.7.239:19090',
        //target: 'http://192.168.12.89:8080',
         target:'https://fox.itsomg.com',   //线上环境
        // target: 'http://192.168.6.238:2324',  //测试环境
      //  target: 'https://backend-beta.pixy.tv',  //预发环境
        //target: targetEnv[process.env.NODE_ENV],
        //target:'http://127.0.0.1:10085',//my self
        // target:'http://192.168.12.104:8080',//song zhangxi
        secure: false,
        changeOrigin: true
      },
      '/upload/file5/upload/*':{
        target:'https://backend.pixy.tv',
        secure:false
      },
      '/contentservice/*':{
        target: 'http://192.168.14.77:8080',
      }
    }
  }
};

