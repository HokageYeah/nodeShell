import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// 缓存
let dataCache: any = null;

const loadData = () => {
    // 没有缓存就读取
    if (!dataCache) {
        const _dirname = path.dirname(url.fileURLToPath(import.meta.url))
        const file = path.resolve(_dirname, './mock/data.json')
        console.log('file', file);
        const data = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))
        const reports = data.dailyReports; // 数组格式的数据 
        // console.log('reports', reports);
        dataCache = {};
        // 把数组数据转换成以日期为key的JSON格式并缓存起来
        reports.forEach((element: any) => {
            if (element) {
                dataCache[element.updatedDate] = element
            }
        });
    }
    return dataCache
}
// 获取所有有疫情记录的日期；
const getCoronavirusKeyIndex = () => {
    return Object.keys(loadData());
}
// 获取当前日期对应的疫情数据。
const getCoronavirusByDate = (date: string | number) => {
    const dailyData = loadData()[date] || {};
    if (dailyData.countries) {
        // 按照各国确诊人数排序
        dailyData.countries.sort((a: { confirmed: number; }, b: { confirmed: number; }) => {
            return b.confirmed - a.confirmed;
        });
    }
    return dailyData;
}

export {
    loadData,
    getCoronavirusKeyIndex,
    getCoronavirusByDate
}