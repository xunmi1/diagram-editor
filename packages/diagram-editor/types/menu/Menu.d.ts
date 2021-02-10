import { Observer, Subject, Disposable } from '../utils';
import { MenuItem } from './MenuItem';
export declare class Menu<T extends MenuItem<T>> extends Subject {
  protected readonly list: Map<string, T>;
  protected constructor();
  get groups(): string[];
  set groups(groups: string[]);
  load(key: string, item: T, parentKey?: string): void;
  get(key: string): T | undefined;
  onDidLoad(
    callback: Observer<{
      parentKey?: string;
      parent?: T;
      key: string;
      item: T;
    }>
  ): Disposable;
  onDidChangeGroups(callback: Observer<void>): Disposable;
  [Symbol.iterator](): IterableIterator<[string, T]>;
  forEach(callback: (value: T, key: string) => void): void;
}
