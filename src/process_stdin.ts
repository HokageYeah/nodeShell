console.log('请输入一个要求和的整数，以0结束输入');

process.stdin.setEncoding('utf8');

let sum = 0;
process.stdin.on('readable', () => {
    const chunk = process.stdin.read(); // 获取当前输入的字符，包含回车
    console.log('chunk', chunk);
    const n = Number(chunk.slice(0, -1));
    sum += n;
    if (n === 0) process.stdin.emit('end');
    if (n !== 0) process.stdin.read(); // 再调用一次，返回的是null，并继续监听
});

process.stdin.on('end', () => {
    console.log(`求和结果是：${sum}`);
});
