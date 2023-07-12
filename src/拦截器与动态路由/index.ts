import Interceptor from "./Interceptor.js";
function wait(ms: number | undefined) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// 拦截器的例子如何调用
const inter = new Interceptor();

const task = function (id: number) {
  return async (ctx: { count: number }, next: () => any) => {
    try {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });
