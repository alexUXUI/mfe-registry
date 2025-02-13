const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3001,
    allowedHosts: "auto",
    https: true,
    proxy: {
      '/api': {
        target: 'https://i9cfxuwzve.execute-api.us-west-2.amazonaws.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/Stage/projects/835b7fe4-9007-4bd0-af99-34c4412d2975/microFrontends'
        },
        secure: false,
      },
    },
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      "process.env.DISCOVERY_ENDPOINT": JSON.stringify(
        process.env.DISCOVERY_ENDPOINT
      ),
    }),
    new ModuleFederationPlugin({
      name: "AppShell",
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
