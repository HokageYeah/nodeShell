import http from "node:http";
import Interceptor from "./Interceptor.js";
import cluster from 'node:cluster';
import os from 'node:os';

const cpuNums = os.cpus().length; // 获得CPU的内核数
console.log('cpuNums----', cpuNums);


export default class {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  interceptor: Interceptor;
  instances: number;
  enableCluster: boolean;
  worker: import("cluster").Worker | undefined;
  constructor({ instances = 1, enableCluster = true } = {}) {
    this.instances = instances || cpuNums; // 指定启动几个进程，默认启动和cpu的内核数一样多的进程
    this.enableCluster = enableCluster; // 是否启动多进程服务
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

  listen(opts: { host?: any; port: any }, cb = (a: any) => { }) {
    if (typeof opts === "number") opts = { port: opts };
    opts.host = opts.host || "0.0.0.0";
    console.log(`Starting up http-server 你好
    http://${opts.host}:${opts.port}`);
    const instances = this.instances;
    if (this.enableCluster && cluster.isPrimary)  // 如果是主进程，创建instance个子进程
    {
      for (let i = 0; i < instances; i++) {
        cluster.fork(); // 创建子进程
      }

      let count = 0;
      Object.entries(cluster.workers!).forEach(([id, worker]) => {
        worker?.on('message', (msg) => {
          console.log('message -----', msg, typeof msg);
          if (msg === 'count') {
            count++;
            console.log('visit count %d', count);
          }
        })
      });

      // function broadcast(message: any) { // eslint-disable-line no-inner-declarations
      //   Object.entries(cluster.workers!).forEach(([id, worker]) => {
      //     worker?.send(message);
      //   });
      // }

      // // 广播消息
      // Object.entries(cluster.workers!).forEach(([id, worker]) => {
      //   worker?.on('message', broadcast);
      // });

      // 主进程监听exit事件，如果发现有某个子进程停止了，那么重新创建一个子进程
      cluster.on('exit', (worker, code, signal) => {
        console.log('进程worker %d 停止died (%s). 重启中restarting...',
          worker.process.pid, signal || code);
        cluster.fork()
      })
    } else {
      // 如果当前进程是子进程
      this.worker = cluster.worker;
      console.log(`Starting up http-server
      http://${opts.host}:${opts.port}`);
      this.server.listen(opts, () => cb(this.server));
    }
    // this.server.listen(opts, () => cb(this.server));
  }

  use(aspect: any) {
    // 向http服务器添加不同功能的拦截切面
    return this.interceptor.use(aspect);
  }
};
