import { readFile } from 'fs';
import path from 'node:path'
import { fileURLToPath } from 'url';
import { createRandomPicker } from './random.js';
import { generate } from './generator.js';
import { saveCorpus } from './corpus.js';
import { cmmandOptions, parseOptions, usage } from './cmd.js';
import { interact } from './interact.js';


// const es_url1 = decodeURI(import.meta.url);
// console.log(es_url1);
// const es_url = new URL(import.meta.url);
// // console.log(es_url);
// const scriptPath = decodeURIComponent(es_url.pathname); // 解码路径
// console.log(scriptPath);
// const scriptDirectory = path.dirname(scriptPath); // 获取脚本所在目录路径
// console.log(scriptDirectory);
// const dataPath = path.resolve(scriptDirectory, '..', 'corpus', 'data.json'); // 构建 data.json 的完整路径
// console.log('dataPath',scriptDirectory);


// 使用es6的转换语法， 环境变量使用import.meta.url
const shellScriptPath = new URL('./corpus/data.json', import.meta.url).pathname;
console.log('shellScriptPath', shellScriptPath);
const decodedShellScriptPath = decodeURI(shellScriptPath);
const normalizedPath = path.normalize(decodedShellScriptPath);
console.log('normalizedPath', normalizedPath);
const data_path = path.join(".", normalizedPath);


/**
 * 注意，因为本项目采用ES Modules模块规范，所以需要通过fileURLToPath来转换路径。
 * 如果采用CommonJS规范，就可以直接通过模块中的内置变量__dirname获得当前 JS 文件的工作目录。
 * 因此在使用CommonJS规范时，上面的代码可以简写为const path = resolve(__dirname, 'corpus/data.json')。
 */ 
const url = import.meta.url; // 获取当前脚本文件的url
console.log('import.meta', import.meta);
console.log('process', process);
console.log('url:===?', url)
const fileURLToPathstr = fileURLToPath(url)
console.log('fileURLToPathstr', fileURLToPathstr);
const dirname = path.dirname(fileURLToPathstr)
console.log('dirname', dirname);
const pathtest = path.resolve(dirname, './corpus/data.json');
console.log('pathtest', pathtest);



// 使用commonjs的语法， 环境变量使用 __dirname
// const data_path = path.resolve(__dirname, './corpus/data.json')
// const data_path = path.resolve(scriptDirectory, './corpus/data.json')
console.log('data_path', data_path);
readFile(data_path, async (err: NodeJS.ErrnoException | null, data: Buffer) => {
    if (!err) {
        const dataStr = data.toString('utf-8')
        // console.log(dataStr);
        const corpus = JSON.parse(dataStr);
        if ('help' in cmmandOptions) {
            console.log(usage);
        } else {
            // const options = parseOptions();
            console.log('options', cmmandOptions);
            let title = cmmandOptions.title || createRandomPicker(corpus.title)(); // 随机选一个title
            if (Object.keys(cmmandOptions).length <= 0) {
                const answers: any = await interact([
                    { text: '请输入文章主题', value: title },
                    { text: '请输入最小字数', value: 6000 },
                    { text: '请输入最大字数', value: 10000 },
                ]);
                console.log('answers',answers);
                title = answers[0];
                cmmandOptions.min = answers[1];
                cmmandOptions.max = answers[2];
            }
            const famous = createRandomPicker(corpus.famous)(); //随机选一句名人名言
            const article = generate(title, { corpus, ...cmmandOptions });
            const outFile = saveCorpus(title, article)
            console.log('title', title);
            console.log('famous', famous);
            console.log(`生成成功！文章保存于：${outFile}`);
            // console.log(`${title}\n\n    ${article.join('\n    ')}`);
        }
    } else {
        console.error(err);
    }
})
