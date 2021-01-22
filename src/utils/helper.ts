export { merge, throttle } from 'lodash-es';

export const warn = (msg: string, ...args: any[]) => {
  console.warn(`[Editor warn]: ${msg}`, ...args);
};

export const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
