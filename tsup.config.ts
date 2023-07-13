import { defineConfig } from "tsup";
import copyfiles from "copyfiles";
// 打包

// 配置插件
const copyFilesPlugin = {
    name: "copy-files-plugin",
    setup: () => {
        copyfiles(["sh/**/*", "dist"], { up: 1 }, (err) => {
            if (err) {
                console.error("复制文件时发生错误:", err);
            } else {
                console.log("文件复制完成。");
            }
        });
    },
};

export default defineConfig({
    target: "node12",
    entryPoints: ["src/index.ts"], // 根据实际情况修改入口文件路径
    format: ["esm"],
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: true,
    legacyOutput: true,
    // esbuildPlugins: [copyFilesPlugin],
    // external: ['child_process', 'https'], // 将 child_process 模块标记为外部依赖
    // external: ['https'],
    // external: ['child_process'],
    // external: ['https', 'child_process'],
    // external: ['https', 'child_process', 'fs'],
});
