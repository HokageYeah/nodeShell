import http from 'node:http'
import url from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import mime from 'mime'

// 普通的readFileSync 来读取文件
// const server = http.createServer((req, res) => {
//     const pathurl = import.meta.url;
//     const _dirname = path.dirname(url.fileURLToPath(pathurl))
//     console.log('req.url', req.url);
//     console.log('_dirname', _dirname);
//     // let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`))); // 解析请求的路径
//     // console.log('name',  path.join('www', url.fileURLToPath(`file:///${req.url}`)));
//     let filePath = path.resolve(_dirname, '.' + req.url as string); // 解析请求的路径
//     console.log('filePath', filePath);

//     if (fs.existsSync(filePath)) {
//         const stats = fs.statSync(filePath);
//         const isDir = stats.isDirectory();
//         if (isDir) {
//             filePath = path.join(filePath, 'index.html');
//         }
//         console.log('filePath2', filePath);
//         if (!isDir || fs.existsSync(filePath)) {
//             const content = fs.readFileSync(filePath); // 读取文件内容
//             const { ext } = path.parse(filePath); // 得到文件扩展名
//             // if(ext === '.png') {
//             //     res.writeHead(200, {'Content-Type': 'image/png'})
//             // } else {
//             //     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//             // }
//             // 使用第三方库 mime
//             res.writeHead(200, { 'Content-Type': mime.getType(ext)! });
//             return res.end(content); // 返回文件内容
//         }
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/html' });
//         res.end('<h1>Not Found</h1>');
//     }
// });

// Stream 流式读取文件
const server = http.createServer((req, res) => {
    const pathurl = import.meta.url;
    const _dirname = path.dirname(url.fileURLToPath(pathurl))
    console.log('req.url', req.url);
    console.log('_dirname', _dirname);
    // let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`))); // 解析请求的路径
    // console.log('name',  path.join('www', url.fileURLToPath(`file:///${req.url}`)));
    let filePath = path.resolve(_dirname, '.' + req.url as string); // 解析请求的路径
    console.log('filePath', filePath);

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const isDir = stats.isDirectory();
        if (isDir) {
            filePath = path.join(filePath, 'index.html');
        }
        console.log('filePath2', filePath);
        if (!isDir || fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath); // 读取文件内容
            const { ext } = path.parse(filePath); // 得到文件扩展名
            // 使用第三方库 mime
            res.writeHead(200, { 'Content-Type': mime.getType(ext)! });
            const fileStream = fs.createReadStream(filePath); //以流的方式读取文件内容
            fileStream.pipe(res); // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Not Found</h1>');
    }
});

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8080, () => {
    console.log('opened server on', server.address());
});