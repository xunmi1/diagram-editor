import type { Icon, IIconProps } from '@icon-park/svg/es/runtime';

export { merge, throttle } from 'lodash-es';

export const warn = (msg: string, ...args: any[]) => {
  console.warn(`[Editor warn]: ${msg}`, ...args);
};

export const error = (msg: string, ...args: any[]) => {
  console.error(`[Editor error]: ${msg}`, ...args);
};

export const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const lazyTask = <T extends (...args: any[]) => ReturnType<T>>(func: T) => {
  let timer: number | undefined;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      result = func.apply(this, args);
    }, 0);

    return result;
  };
};

const extraSVGAttrs: IIconProps = { size: '1em', fill: 'currentColor', strokeWidth: 4 };
export const stringifySVG = (icon: Icon) => icon(extraSVGAttrs);
