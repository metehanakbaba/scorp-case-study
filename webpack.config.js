const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public/index.html" },
        { from: "public/main.css" },
        { from: "public/assets", to: "assets" },
      ],
    }),
  ],
};

module.exports = config;
