import httpServer from "./httpServer.js";
import Router from "./router_middleware.js";
import { getCoronavirusByDate, getCoronavirusKeyIndex } from './mock.js'
import param from "./param.js";
import fs from 'node:fs';
import handlebars from "handlebars"
import path from "node:path";
import url from "node:url";
const app = new httpServer();
const router = new Router();

/**
 * 这是一个注释
 */

/** 我是一个注释 */
// 路径
const getFile = (pahtStr: string) => {
  const _dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const file = path.resolve(_dirname, pahtStr)
  return file
}

// 第一个拦截切面是提供 log，这样我们在服务器的控制台上就能知道用户访问了哪个 URL。
app.use(({ req }: any, next: () => void) => {
  console.log(`请求：----${req.method} ${req.url}`);
  next();
});

// // 第二个拦截切面是前面实现的解析 GET 参数的拦截切面，每一个请求都会经过这个切面以获得 URL 中的 query 对象，不过这里我们暂时没有用到它
app.use(param);

// 配置mock路由 json数据返 回获取所有有疫情记录的日期；
app.use(router.get('/coronavirus/index', async ({ route, res }, next) => {
  const index = getCoronavirusKeyIndex();
  res.setHeader("Content-Type", "application/json");
  res.body = { data: index };
  await next();
}));

// 服务端渲染 获取所有有疫情记录的日期
app.use(router.get('/server/coronavirus/index', async ({ route, res }, next) => {
  const index = getCoronavirusKeyIndex();

  // 获取模板文件
  const tpl = fs.readFileSync(getFile('./view/coronavirus_index.html'), { encoding: 'utf-8' })

  // 编译模板
  const template = handlebars.compile(tpl);
  // 将数据和模板结合
  const result = template({ data: index });
  res.setHeader("Content-Type", "text/html");
  res.body = result;
  await next();
}));

// 获取当前日期对应的疫情数据。
app.use(router.get("/coronavirus/:date", async ({ route, res }, next) => {
  const data = getCoronavirusByDate(route.date);
  res.setHeader('Content-Type', 'application/json');
  res.body = { data }
  await next()
}));

// 服务端渲染 获取当前日期对应的疫情数据
app.use(router.get("/server/coronavirus/:date", async ({ params, route, res }, next) => {
  const data = getCoronavirusByDate(route.date);
  // 返回json数据
  if (params.type === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.body = { data }
  } else {
    // 服务端渲染逻辑
    // 获取模板文件
    const tpl = fs.readFileSync(getFile('./view/coronavirus_date.html'), { encoding: 'utf-8' })
    // 编译模板
    const template = handlebars.compile(tpl);
    const result = template({ data });
    res.setHeader('Content-Type', 'text/html');
    res.body = result
  }
  await next()
}));

app.use(
  router.all("/test/:course/:lecture", async ({ route, res }, next) => {
    res.setHeader("Content-Type", "application/json");
    res.body = route;
    await next();
  })
);

app.use(
  router.all(".*", async ({ req, res }, next) => {
    res.setHeader("Content-Type", "text/html");
    res.body = "<h1>Hello world</h1>";
    await next();
  })
);

// 添加拦截切面
// app.use(async ({ res }: any, next: () => any) => {
//   res.setHeader("Content-Type", "text/html");
//   res.body = "<h1>Hello world</h1>";
//   await next();
// });

app.listen({
  port: 9090,
  host: "0.0.0.0",
});

// 未添加任何拦截函数
