const objectToString = Object.prototype.toString;
export const toRawType = (val: unknown): string => objectToString.call(val).slice(8, -1);

export const isNumber = (val: unknown): val is number => typeof val === 'number';
export const isUndefined = (val: unknown): val is undefined => val === undefined;
// eslint-disable-next-line
export const isFunction = <T extends Function>(val: unknown): val is T => typeof val === 'function';
export const isArray = Array.isArray;
export const isObject = (val: unknown): val is Record<string, unknown> => val !== null && typeof val === 'object';

export const asyncify =
  <T extends (...args: unknown[]) => ReturnType<T>>(fn: T) =>
  (...args: Parameters<T>): Promise<ReturnType<T>> =>
    Promise.resolve().then(() => fn(...args));
