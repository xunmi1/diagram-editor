import { GROUP_TAG } from '../constants';

export const getGroups = (groups: string[]) => {
  const temp = groups.reduce<string[]>((pre, key) => {
    // 移除重复的菜单 key
    if (key !== GROUP_TAG) {
      const index = pre.indexOf(key);
      if (index > -1) pre.splice(index, 1);
    }
    pre.push(key);
    return pre;
  }, []);

  return temp.reduce<string[]>((pre, key, index) => {
    if (key === GROUP_TAG) {
      // 只移除起始位置的分隔符
      if (index === 0) return pre;
      // 相邻的分隔符去重
      if (index > 0 && temp[index - 1] === GROUP_TAG) return pre;
    }
    pre.push(key);
    return pre;
  }, []);
};
