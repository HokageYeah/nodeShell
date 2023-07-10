export function randomInt(min: number, max: number) {
    const p = Math.random();
    return Math.floor(min * (1 - p) + max * p);
}

// 避免连续两次选择到同样的元素算法
// export function randomPick(arr:any) {
//     const len = arr.length - 1;
//     const index = randomInt(0, len);
//     [arr[index], arr[len]] = [arr[len], arr[index]];
//     return arr[index];
// }
export function createRandomPicker(arr: any) {
    arr = [...arr]; // copy 数组，以免修改原始数据
    function randomPick() {
      const len = arr.length - 1;
      const index = randomInt(0, len);
      const picked = arr[index];
      [arr[index], arr[len]] = [arr[len], arr[index]];
      return picked;
    }
    randomPick(); // 抛弃第一次选择结果
    return randomPick;
  }