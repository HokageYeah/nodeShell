// 拦截器实现
class Interceptor {
    aspects: any[];
    constructor() {
        this.aspects = []; // 用于存储拦截切面
    }

    use(/* async */ functor: any) { // 注册拦截切面
        this.aspects.push(functor);
        return this;
    }

    async run(context: any) { // 执行注册的拦截切面
        const aspects = this.aspects;

        // 将注册的拦截切面包装成一个洋葱模型
        const proc = aspects.reduceRight(function (a, b) { // eslint-disable-line
            return async () => {
                await b(context, a);
            };
        }, () => Promise.resolve());

        try {
            await proc(); //从外到里执行这个洋葱模型
        } catch (ex: any) {
            console.error(ex.message);
        }

        return context;
    }
}

export default Interceptor;
