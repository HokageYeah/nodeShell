import url from 'node:url'
import querystring from 'node:querystring'

export default async (ctx: any, next: any) => {
    const { req } = ctx;
    const { query } = url.parse(`http://${req.headers.host}${req.url}`);
    
    ctx.params = querystring.parse(<string>query);
    console.log('params.query-----', query);
    console.log('params.querystring----', querystring.parse(<string>query));

    await next();
}