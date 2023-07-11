import http from 'node:http'
import url from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import mime from 'mime'
import zlib from 'node:zlib'

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
        // 强缓存
        // if (!isDir || fs.existsSync(filePath)) {
        //     const content = fs.readFileSync(filePath); // 读取文件内容
        //     const { ext } = path.parse(filePath); // 得到文件扩展名
        //     // 使用第三方库 mime
        //     res.writeHead(200, {
        //         'Content-Type': mime.getType(ext)!,
        //         'Cache-Control': 'max-age=86400', // 缓存一天
        //     });
        //     const fileStream = fs.createReadStream(filePath); //以流的方式读取文件内容
        //     fileStream.pipe(res); // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
        // }
        // 协商缓存
        if (!isDir || fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath); // 读取文件内容
            const { ext } = path.parse(filePath); // 得到文件扩展名
            const timeStamp = req.headers['if-modified-since'];
            let status = 200;
            if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
                // stats.mtimeMs表示文件的修改时间
                // 如果timeStamp和stats.mtimeMS相等，说明文件内容没有修改
                status = 304
            }
            // 使用第三方库 mime
            // 根据mimetype 只对 text、appliaction 类型启用压缩，
            const mimeType = mime.getType(ext);
            const responseHeaders: any = {
                'Content-Type': mimeType!,
                'Cache-Control': 'max-age=86400', // 缓存一天
                'Last-Modified': stats.mtimeMs, // 协商缓存响应头
            };
            const acceptEncoding = req.headers['accept-encoding'];
            const compress = acceptEncoding && /^(text|application)\//.test(mimeType!);
            if (compress) {
                // 返回客户端支持的一种压缩方式
                // 告诉浏览器该文件是用deflate算法压缩的
                (<string>acceptEncoding).split(/\s*,\s*/).some((encoding) => {
                    if (encoding === 'gzip') {
                        responseHeaders['Content-Encoding'] = 'gzip';
                        return true;
                    }
                    if (encoding === 'deflate') {
                        responseHeaders['Content-Encoding'] = 'deflate';
                        return true;
                    }
                    if (encoding === 'br') {
                        responseHeaders['Content-Encoding'] = 'br';
                        return true;
                    }
                    return false;
                });
            }
            const compressionEncoding = responseHeaders['Content-Encoding']; // 获取选中的压缩方式
            res.writeHead(status, responseHeaders);

            if (status === 200) {
                const fileStream = fs.createReadStream(filePath); //以流的方式读取文件内容
                if (compress && compressionEncoding) {
                    let comp;
                    // 使用指定的压缩方式压缩文件
                    if (compressionEncoding === 'gzip') {
                        comp = zlib.createGzip();
                    } else if (compressionEncoding === 'deflate') {
                        comp = zlib.createDeflate();
                    } else {
                        comp = zlib.createBrotliCompress();
                    }
                    fileStream.pipe(comp).pipe(res)
                } else {
                    fileStream.pipe(res);
                }
                // fileStream.pipe(res); // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
                // fileStream.pipe(zlib.createDeflate()).pipe(res); // 压缩请求资源
            } else {
                res.end(); // 如果状态码不是200，不用返回Body
            }
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