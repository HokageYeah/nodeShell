import { env } from "process";
import * as argv from "./node_demo";
import builtinModules from "node:module";
let a: number = 1;
console.log(a);

interface call {
  <Yeah>(a: Yeah): Yeah;
}
const demo: call = (a) => {
  return a;
};

const res = demo({
  count: 1,
  message: 2,
});

const res2 = demo("123");
console.log(res2.charAt(1));
// console.log(argv);
// console.log(env);
// console.log(builtinModules);

// 在 TypeScript 中，infer 关键字用于从函数签名中推断类型。它通常用于条件类型（conditional types）中，
// 结合条件判断（extends）来提取泛型类型的一部分。下面是 infer 的基本用法和示例：
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
function getUserInfo() {
  return { name: "Alice", age: 28 };
}

type User = ReturnType<typeof getUserInfo>; // 推断 User 的类型为 { name: string, age: number }

const user: User = {
  name: "Alice",
  age: 28,
};
