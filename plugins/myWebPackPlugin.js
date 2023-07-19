class MyWebPackPlugin {
    // apply()在webpack启动过程中自动被调用，它接收一个compiler对象
    // 该对象包含此次构建过程中所有的配置信息，我们也是通过该对象注册构子函数
    apply(compiler) {
        // 在这里实现你的插件逻辑
        // console.log('compiler----', compiler);
        // 通过compiler的hooks属性访问到emit钩子，通过tap方法注册一个钩子函数
        // tap()接收2该参数，1: 插件名称；2:挂载到钩子上的函数
        compiler.hooks.emit.tap('myPlugin', compilation => {
            // console.log('compilation----', compilation);
            // compilation===>可以理解为此次打包的上下文
            for (const name in compilation.assets) {
                console.log(name) // dis文件下所有文件名称
                // console.log(compilation.assets[name].source())  //  dis文件下所有文件内容
                // 只针对js文件进行处理，去调注释
                if (name.endsWith('.js')) {
                    console.log('只针对js文件进行处理，去调注释');
                    const contents = compilation.assets[name].source()
                    const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
                    // const withoutComments = contents.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}

module.exports = MyWebPackPlugin;


// class LogWebpackPlugin{
//     constructor(doneCallback,emitCallback){
//        this.emitCallback = emitCallback;
//        this.doneCallback = doneCallback;
//     }
//     apply(compiler){
//         compiler.hooks.emit.tap('LogWebpackPlugin',()=>{
//             //在 emit 事件中回调 emit Callbackthis.emitCallback()
//         })
//         compiler.hooks.done.tap('LogWebpackPlugin',()=>{
//             //在 done 事件中回调 done Callbackthis.emitCallback()
//         })
//         compiler.hooks.compilation.tap('LogWebpackPlugin',()=>{
//             // compilation（'编译器'对'编译ing'这个事件的监听）
//         })
//         compiler.hooks.compile.tap('LogWebpackPlugin',()=>{
//             // compile（'编译器'对'开始编译'这个事件的监听）
//         })
//     }
// }
// module.exports = LogWebpackPlugin
