import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

export function parseOptions(options: any = {}) {
    const argv = process.argv;
    for (let i = 2; i < argv.length; i++) {
        const cmd = argv[i - 1];
        const value = argv[i];
        if (cmd === '--title') {
            options.title = value;
        } else if (cmd === '--min') {
            options.min = Number(value);
        } else if (cmd === '--max') {
            options.max = Number(value);
        }
    }
    return options;
}

const optionDefinitions = [
    {name: 'help'}, // help命令配置
    { name: 'title', type: String },
    { name: 'min', type: Number },
    { name: 'max', type: Number },
];
// 定义帮助的内容
const sections = [
    {
      header: '狗屁不通文章生成器',
      content: '生成随机的文章段落用于测试',
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'title',
          typeLabel: '{underline string}',
          description: '文章的主题。',
        },
        {
          name: 'min',
          typeLabel: '{underline number}',
          description: '文章最小字数。',
        },
        {
          name: 'max',
          typeLabel: '{underline number}',
          description: '文章最大字数。',
        },
      ],
    },
  ];

export const cmmandOptions = commandLineArgs(optionDefinitions)

export const usage = commandLineUsage(sections); // 生成帮助文本
