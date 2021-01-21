import { merge, throttle as _throttle, ThrottleSettings } from 'lodash-es';

export { merge };
export const throttle = <T extends (...args: any) => any>(func: T, wait?: number, options?: ThrottleSettings) =>
  _throttle(func, wait, options);

export const warn = (msg: string, ...args: any[]) => {
  console.warn(`[Editor warn]: ${msg}`, ...args);
};

export const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
