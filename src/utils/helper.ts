export { merge } from 'lodash-es';

export const warn = (msg: string, ...args: any[]) => {
  console.warn(`[Editor warn]: ${msg}`, ...args);
};
