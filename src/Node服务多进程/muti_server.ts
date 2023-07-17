import http from 'node:http'
import cluster from 'node:cluster'
import os from 'node:os'

const numCPUs = os.cpus().length

function febonacci(n: any): any {
    if (n <= 2) return 1;
    return febonacci(n - 1) + febonacci(n - 2);
}

if (cluster.isMaster) {
    console.log("master: ");
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    http.createServer((req, res) => {
        febonacci(37);
        res.end("hello world");
    }).listen(8088, () => {
        console.log("listen 8088");
    });
}
