const path = require('path');

const webpackConfig = {
  devtool: 'inline-source-map',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules|\-test\.js$/,
      use: {
        loader: 'istanbul-instrumenter-loader',
        options: {
          esModules: true
        }
      }
    }]
  }
};

module.exports = function c(config) {
  config.set({
    basePath: '.',
    frameworks: ['mocha'],
    files: ['test/*.js'],
    preprocessors: {
      'src/*.js': ['webpack', 'sourcemap'],
      'test/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  });
};
