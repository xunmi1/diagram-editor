export { merge, throttle } from 'lodash-es';
import type { Icon } from '@icon-park/svg/es/runtime';
export declare const warn: (msg: string, ...args: any[]) => void;
export declare const error: (msg: string, ...args: any[]) => void;
export declare const delay: (timeout: number) => Promise<unknown>;
export declare const lazyTask: <T extends (...args: any[]) => any>(
  func: T
) => (this: unknown, ...args: Parameters<T>) => ReturnType<T>;
export declare const stringifySVG: (icon: Icon) => string;
