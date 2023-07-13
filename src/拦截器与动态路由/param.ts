import url from 'node:url'
import querystring from 'node:querystring'
import { resolve } from 'node:path';

export default async (ctx: any, next: any) => {
    const { req } = ctx;
    const { query } = url.parse(`http://${req.headers.host}${req.url}`);
    // const myURL = new URL(`http://${req.headers.host}${req.url}`);
    // const query = myURL.searchParams;


    ctx.params = querystring.parse(<string>query);
    console.log('params.query-----', query);
    console.log('params.querystring----', querystring.parse(<string>query));

    // 解析POST
    if (req.method === 'POST') {
        const headers = req.headers;
        // 读取POST的body数据
        const body: string = await new Promise((resolve) => {
            let data = ''
            req.on('data', (chunk: { toString: () => string; }) => {
                data += chunk.toString()
            })
            req.on('end', () => {
                resolve(data)
            })
        })
        ctx.params = ctx.params || {}
        if (headers['content-type'] === 'application/x-www-form-urlencoded') {
            console.log('application/x-www-form-urlencoded');
            Object.assign(ctx.params, querystring.parse(body))
        } else if (headers['content-type'] === 'application/json') {
            Object.assign(ctx.params, JSON.parse(body))
        }
    }

    await next();
}