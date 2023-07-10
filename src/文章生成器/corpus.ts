
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import moment from 'moment'

export const saveCorpus = (title?: string, article?: string[]) => {
    const url = fileURLToPath(import.meta.url)
    const path_url = path.dirname(url)
    // 輸出文件夾
    const outputDir = path.resolve(path_url, './outPut')
    // 輸出的文件名稱
    const time = moment().format('YYYY-MM-DD_HH_mm_ss');
    // 輸出文件完整路徑
    const outputFile = path.resolve(outputDir, `${title}${time}.txt`)
    // 如果路徑下沒有文件夾則創建
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
    }
    const text = `${title}\n\n    ${article!.join('\n    ')}`;
    console.log('outputFile', outputFile);
    // 同步寫入文件
    fs.writeFileSync(outputFile, text)
    return outputFile;
}