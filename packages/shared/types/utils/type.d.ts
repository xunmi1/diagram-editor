export declare const toRawType: (val: unknown) => string;
export declare const isNumber: (val: unknown) => val is number;
export declare const isUndefined: (val: unknown) => val is undefined;
export declare const isFunction: (val: unknown) => val is Function;
export declare const isArray: (arg: any) => arg is any[];
export declare const isObject: (val: unknown) => val is object;
export declare const asyncify: <T extends (...args: unknown[]) => any>(
  fn: T
) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
