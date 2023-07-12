import httpServer from "./httpServer.js";
import Router from "./router_middleware.js";
const app = new httpServer();
const router = new Router();

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
