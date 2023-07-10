// 方法一
// interact.js
// export function interact(questions: any[]) {
//     // questions 是一个数组，内容如 {text, value}
//     process.stdin.setEncoding('utf8');

//     return new Promise((resolve) => {
//         const answers: any[] = [];
//         let i = 0;
//         let { text, value } = questions[i++];
//         console.log(`${text}(${value})`);
//         process.stdin.on('readable', () => {
//             // const chunk = process.stdin.read().slice(0, -1); 此方法会有为 \r的存在
//             const chunk = process.stdin.read().toString().trim();
//             console.log('chunk', chunk);
//             answers.push(chunk || value); // 保存用户的输入，如果用户输入为空，则使用缺省值
//             const nextQuestion = questions[i++];
//             if (nextQuestion) { //如果问题还未结束，继续监听用户输入
//                 process.stdin.read();
//                 text = nextQuestion.text;
//                 value = nextQuestion.value;
//                 console.log(`${text}(${value})`);
//             } else { // 如果问题结束了，结束readable监听事件
//                 console.log('readable-answers',answers);
//                 resolve(answers);
//             }
//         });
//     });
// }



import readline from 'readline';
// 方法二 使用 readline模块
function question(rl: any, { text, value }: { [str: string]: any }) {
    const q = `HokageYeah${text}(${value})\n`;
    return new Promise((resolve) => {
        rl.question(q, (answer: any) => {
            resolve(answer || value);
        });
    });
}

export async function interact(questions: string | any[]) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answers = [];
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const answer = await question(rl, q); // 等待问题的输入
        answers.push(answer);
    }
    rl.close();
    return answers;
}
