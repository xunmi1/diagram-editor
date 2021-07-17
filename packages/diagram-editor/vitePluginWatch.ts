/* eslint-disable */
// @ts-nocheck
import path from 'path';
import fs from 'fs';
import type { Plugin } from 'vite';

const getPackages = (rootPath: string): [string, string][] => {
  try {
    const rootPkg = require(path.resolve(__dirname, rootPath, 'package.json'));
    const folders: string[] = rootPkg.workspaces.flatMap(workspace => {
      if (workspace.includes('/*')) {
        const folderWithWorkspaces = workspace.replace('/*', '');
        const workspacesFolders = fs.readdirSync(path.resolve(__dirname, rootPath, folderWithWorkspaces));
        return workspacesFolders.map(folderName => path.join(folderWithWorkspaces, folderName));
      }
      return workspace;
    });

    const findEntry = (folderPath: string): [string, string] => {
      const resolve = (...paths: string[]): string => path.resolve(folderPath, ...paths);
      try {
        const name: string = require(resolve('package.json')).name;
        // 首先寻找根位置的 `index.ts`, 其次是 `src/index.ts`
        const filePath = resolve('./index.ts');
        if (fs.existsSync(filePath)) return [name, filePath];
        const srcPath = resolve('./src/index.ts');
        if (fs.existsSync(srcPath)) return [name, srcPath];
      } catch (e) {
        throw new Error(`vite-plugin-watch-workspaces: ${e.message}`);
      }
      throw new Error(`vite-plugin-watch-workspaces: The entry file was not found.`);
    };

    return folders.map(folder => path.resolve(process.cwd(), rootPath, folder)).map(findEntry);
  } catch (e) {
    throw new Error(`vite-plugin-watch-workspaces: ${e.message}`);
  }
};

/**
 * 观察其他工作空间的代码变化
 * 通过自动添加别名实现
 * @param rootPath 项目根路径
 * @param exclude 排除项
 */
const watchWorkspaces = (rootPath: string, exclude: string[] = []): Plugin => {
  const packages = getPackages(rootPath);

  return {
    name: 'vite-plugin-watch-workspaces',

    config: (userConfig, env) => {
      if (env.command !== 'serve') return;
      const userAlias = Object.values(userConfig.resolve?.alias ?? {});
      const optimizeDeps = userConfig.optimizeDeps ?? {};
      const excludeList = [...exclude, ...(optimizeDeps.include ?? []), ...(optimizeDeps.exclude ?? [])];
      const addition = packages.filter(
        ([name, fullPath]) => !excludeList.includes(name) && !userAlias.find(v => fullPath.includes(v))
      );

      const modifiedConfig = {
        resolve: {
          alias: Object.fromEntries(addition),
        },
      };

      console.info(`Additional alias: \x1B[36m${addition.map(([name]) => name)}\x1B[0m`);

      return modifiedConfig;
    },
  };
};

export default watchWorkspaces;
