// @ts-nocheck
import path from 'path';
import fs from 'fs';
import type { Plugin } from 'vite';

const getPackages = (rootPath: string): [string, string][] => {
  // eslint-disable-next-line
  const rootPkg = require(path.resolve(__dirname, rootPath, 'package.json'));
  const folders: string[] = rootPkg.workspaces.flatMap(workspace => {
    if (workspace.includes('/*')) {
      const folderWithWorkspaces = workspace.replace('/*', '');
      const workspacesFolders = fs.readdirSync(path.resolve(__dirname, rootPath, folderWithWorkspaces));
      return workspacesFolders.map(folderName => path.join(folderWithWorkspaces, folderName));
    }
    return workspace;
  });

  const findEntry = (folderPath: string): [string, string] | void => {
    const resolve = (...paths: string[]): string => path.resolve(folderPath, ...paths);
    // eslint-disable-next-line
    const name: string = require(resolve('package.json')).name;
    // 首先寻找根位置的 `index.ts`, 其次是 `src/index.ts`
    const rootPath = resolve('./index.ts');
    if (fs.existsSync(rootPath)) return [name, rootPath];
    const srcPath = resolve('./src/index.ts');
    if (fs.existsSync(srcPath)) return [name, srcPath];
  };
  return folders
    .map(folder => path.resolve(process.cwd(), rootPath, folder))
    .map(findEntry)
    .filter(Boolean);
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
      const userAlias = Object.values(userConfig.resolve.alias);
      const optimizeDeps = userConfig.optimizeDeps ?? {};
      const excludeList = [...exclude, ...(optimizeDeps.include ?? []), ...(optimizeDeps.exclude ?? [])];
      const addition = packages.filter(
        ([name, fullPath]) => !excludeList.includes(name) && !userAlias.find(path => fullPath.includes(path))
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
