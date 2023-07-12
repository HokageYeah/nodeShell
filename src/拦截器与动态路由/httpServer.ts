import http from "node:http";
import Interceptor from "./Interceptor.js";

export default class {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  interceptor: Interceptor;
  constructor() {
    const interceptor = new Interceptor();

    this.server = http.createServer(async (req, res: any) => {
      await interceptor.run({ req, res }); // 执行注册的拦截函数
      if (!res.writableFinished) {
        let body = res.body || "200 OK";
        console.log('body.pipe', body.pipe);
        if (body.pipe) {
          body.pipe(res);
        } else {
          if (
            typeof body !== "string" &&
            res.getHeader("Content-Type") === "application/json"
          ) {
            body = JSON.stringify(body);
            console.log('Content-Type', body);
          }
          console.log('res.end', body);
          res.end(body);
        }
      }
    });

    this.server.on("clientError", (err, socket) => {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });

    this.interceptor = interceptor;
  }

  listen(opts: { host?: any; port: any }, cb = (a: any) => {}) {
    if (typeof opts === "number") opts = { port: opts };
    opts.host = opts.host || "0.0.0.0";
    console.log(`Starting up http-server
    http://${opts.host}:${opts.port}`);
    this.server.listen(opts, () => cb(this.server));
  }

  use(aspect: any) {
    // 向http服务器添加不同功能的拦截切面
    return this.interceptor.use(aspect);
  }
};
