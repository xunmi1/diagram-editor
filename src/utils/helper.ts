export { merge, throttle } from 'lodash-es';

export const warn = (msg: string, ...args: any[]) => {
  console.warn(`[Editor warn]: ${msg}`, ...args);
};

export const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const lazyTask = <T extends (...args: any[]) => any>(func: T) => {
  let timer: number | undefined;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      result = func.apply(this, args);
    }, 0);

    return result;
  };
};
