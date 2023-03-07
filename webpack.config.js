const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const currentTask = process.env.npm_lifecycle_event;

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-nested'),
  require('postcss-simple-vars'),
  require('autoprefixer')
]

module.exports = {
  mode: "development",
  entry: {
    app: "./app/scripts/App.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "docs"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: `./app/index.html`,
    }),
    new MiniCssExtractPlugin({ filename: "styles.[contenthash].css" }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          currentTask == "build" ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: postCSSPlugins
              }
            }
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    watchFiles: ['./app/**/*.html'],
    static: {
      directory: path.resolve(__dirname, "docs"),
    },
    port: 3000,
    hot: true,
  },
};
