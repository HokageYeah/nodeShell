import net from 'node:net'

function responseData(str: string, status = 200, desc = 'OK') {
    return `HTTP/1.1 ${status} ${desc}\r
Content-Type: text/html; charset=utf-8\r
Connection: keep-alive\r
Date: ${new Date()}\r
Content-Length: ${str.length}\r
\r\n
  ${str}`;
}

const html = '<h1>你好啊 阿西吧</h1>'
const headers = [
    'HTTP/1.1 200 OK',
    'Content-Type: text/html; charset=utf-8',
    `Content-Length: ${html.length}`,
    `Date: ${new Date()}`,
    '\r\n',
    html
]

const server = net.createServer((socket: net.Socket) => {
    socket.on('data', (data) => {
        if (/^GET \/ HTTP/.test(data.toString('utf-8'))) {
            const req = responseData('<h1>你好啊 阿西吧</h1>')
            // const req = headers.join('\r\n')
            console.log("返回---", req);
            socket.write(req)
            socket.end()
            console.log(`cccccDATA数据:\n\n${data}`);
        }
        // const matched = data.toString('utf-8').match(/^GET ([/\w]+) HTTP/);
        // console.log('matched', matched);
        // if (matched) {
        //     const path = matched[1];
        //     if (path === '/') { //如果路径是'/'，返回hello world、状态是200
        //         socket.write(responseData('<h1>whll</h1>'));
        //         socket.end()
        //     } else { // 否则返回404状态
        //         socket.write(responseData('<h1>Not Found</h1>', 404, 'NOT FOUND'));
        //     }
        // }
    })
    socket.on('close', () => {
        console.log('connection closed, goodbye!\n\n\n');
    });
}).on('error', (err) => {
    // handle errors here
    throw err;
});

server.listen({
    host: '0.0.0.0',
    port: 8080,
}, () => {
    console.log('opened server on', server.address());
})