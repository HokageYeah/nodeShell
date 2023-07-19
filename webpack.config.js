const path = require("path");
const fs = require("fs");
const MyWebPackPlugin = require('./plugins/myWebPackPlugin')
// //打包 的时候清空dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 获取所有入口文件
function getEntryPoints() {
  const entryPoints = {};
  const srcPath = "./src";

  // 读取 src 目录下的所有文件和文件夹
  const files = fs.readdirSync(srcPath);

  files.forEach((fileName) => {
    const filePath = path.join(srcPath, fileName);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是文件夹，则当作入口文件
      entryPoints[fileName] = path.resolve(filePath, "index.ts");
    } else if (stat.isFile() && fileName.endsWith(".ts")) {
      // 如果是 JavaScript 文件，则直接当作入口文件
      const entryName = fileName.replace(".ts", "");
      entryPoints[entryName] = path.resolve(srcPath, fileName);
    }
  });

  return entryPoints;
}
// console.log("getEntryPoints------", getEntryPoints());
module.exports = {
  mode: "development",
  target: "node", // 指定构建目标为 Node.js
  //   entry: getEntryPoints(), // 入口文件路径
//   entry: "./src/index.ts", // 入口文件路径http_db_server.ts
  entry: "./src/拦截器与动态路由/http_dynamic.ts", // 入口文件路径http_db_server.ts
  output: {
    filename: "[name].js", // 输出文件名
    path: path.resolve(__dirname, "dist"), // 输出路径
  },
  resolve: {
    extensions: [".ts", ".js"], // 解析文件时自动匹配 .ts 和 .js 扩展名
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // 匹配 TypeScript 文件
        use: "ts-loader", // 使用 ts-loader 加载器处理 TypeScript 文件
        exclude: /node_modules/, // 排除 node_modules 目录
      },
      {
        test: /\.css$/, //解析css
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins:[
    new CleanWebpackPlugin(), //打包清空dist
    new MyWebPackPlugin(),
  ]
};
