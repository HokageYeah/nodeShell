import http from 'node:http'
import cluster from 'node:cluster'
import os from 'node:os'
import fs from 'node:fs'

const cpuNums = os.cpus().length

if (cluster.isPrimary) {
    console.log('在主进程----');
    for (let i = 0; i < cpuNums; i++) {
        cluster.fork()
    }
    // 热更新
    fs.watch(".", { recursive: true }, (eventType: any) => {
        console.log('eventType-----', eventType);
        if (eventType === 'change') {
            Object.entries(cluster.workers!).forEach(([id, worker]) => {
                console.log("worker id: ----- ", id);
                worker?.kill();
            });
            cluster.fork()
            console.log('ddddddddddddclear');
        }
    })
} else {
    //如果是子进程，创建一个HTTP服务器
    const app = http.createServer((req, res) => {
        res.end("hello world1");
        const { url } = req;
    })
    app.listen(8089, () => {
        console.log("listen 8089");
    });
}
