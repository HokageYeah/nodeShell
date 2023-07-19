import http from 'node:http'
import cluster from 'node:cluster'
import os from 'node:os'

const cpuNums = os.cpus().length

// 判断当前进程是否是主进程,主进程的逻辑，主要是创建子进程
if (cluster.isPrimary) {
    console.log("主进程---");
    for (let i = 0; i < cpuNums; i++) {
        cluster.fork()
    }
} else {
    //如果是子进程，创建一个HTTP服务器
    const app = http.createServer((req, res) => {
        res.end("hello world");
    })
    app.listen(8089, () => {
        console.log("listen 8089");
    });
}