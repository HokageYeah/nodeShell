import { env } from 'process';
import * as argv from './node_demo'
import builtinModules from 'node:module'
let a: number = 1
console.log(a);

interface call {
    <Yeah>(a: Yeah): Yeah
}
const demo: call = (a) => {
    return a
}

const res = demo({
    count: 1,
    message: 2
})

const res2 = demo('123')
console.log(res2.charAt(1));
// console.log(argv);
// console.log(env);
// console.log(builtinModules);

