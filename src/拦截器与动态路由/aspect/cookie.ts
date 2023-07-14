// aspect/cookie.js
export async function getCookie (ctx: any, next: any) {
    const { req } = ctx;
    const cookieStr = decodeURIComponent(req.headers.cookie);
    console.log('cookieStr-------', cookieStr);    
    const cookies = cookieStr.split(/\s*;\s*/);
    console.log('cookies-------', cookies);    
    ctx.cookies = {};
    cookies.forEach((cookie) => {
        const [key, value] = cookie.split('=');
        ctx.cookies[key] = value;
    });
    await next();
};
