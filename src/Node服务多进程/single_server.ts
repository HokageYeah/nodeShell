//single_server.js
import http from 'node:http'

function febonacci(n: any): any {
    if (n <= 2) return 1;
    return febonacci(n - 1) + febonacci(n - 2);
}

http.createServer((req, res) => {
    febonacci(37);
    res.end("hello world");
}).listen(8088, () => {
    console.log("listen 8088");
});

