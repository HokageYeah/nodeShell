import httpServer from "./httpServer.js";
import Router from "./router_middleware.js";
import param from "./param.js";
import fs from "node:fs";
import handlebars from "handlebars";
import path from "node:path";
import url from "node:url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { getList } from "./model/todolist.js";

const app = new httpServer();
const router = new Router();

// 路径
const getFile = (pahtStr: string) => {
  const _dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const file = path.resolve(_dirname, pahtStr);
  return file;
};

//
const dbFile = getFile("./database/todolist.db"); // todolist.db是sqlite数据库文件
let db: any = null;

// 第一个拦截切面是提供 log，这样我们在服务器的控制台上就能知道用户访问了哪个 URL。
app.use(async (ctx: any, next: () => void) => {
  if (!db) {
    db = await open({
      filename: dbFile,
      driver: sqlite3.cached.Database,
    });
  }
  ctx.database = db; // 将db挂在ctx上下文对象的database属性上
  console.log(`请求：----${ctx.req.method} ${ctx.req.url}`);
  await next();
});

// // 第二个拦截切面是前面实现的解析 GET 参数的拦截切面，每一个请求都会经过这个切面以获得 URL 中的 query 对象，不过这里我们暂时没有用到它
// app.use(param);

/*
如果请求的路径是/list，则从todo表中获取所有任务数据
*/
app.use(
  router.get("/list", async ({ database, route, res }, next) => {
    res.setHeader("Content-Type", "application/json");
    const result = await getList(database); // 获取任务数据
    console.log("list----", result);
    res.body = { data: result };
    await next();
  })
);

/*
如果路径不是/list, 则返回'<h1>Not Found</h1>'文本
*/
app.use(
  router.all(".*", async ({ params, req, res }, next) => {
    res.setHeader("Content-Type", "text/html");
    res.body = "<h1>Not Found</h1>";
    res.statusCode = 404;
    await next();
  })
);

app.listen({
  port: 9090,
  host: "0.0.0.0",
});

// 未添加任何拦截函数
