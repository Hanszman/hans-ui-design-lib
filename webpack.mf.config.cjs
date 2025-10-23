const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const pkg = require('./package.json');

module.exports = {
  entry: './src/module-federation/widgetBootstrap.tsx',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'cdn'),
    filename: 'remoteBundle.[contenthash].js',
    publicPath: 'auto',
    clean: true,
    uniqueName: 'hans_ui_design_lib',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'defaults' }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'hans_ui_design_lib',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/module-federation/widgetBootstrap.tsx',
        './Button': './src/components/Forms/Button/Button.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: pkg.peerDependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: pkg.peerDependencies['react-dom'],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      templateContent: '<html><body><div id="preview"></div></body></html>',
      inject: false,
    }),
  ],
  optimization: {
    runtimeChunk: false,
  },
};
