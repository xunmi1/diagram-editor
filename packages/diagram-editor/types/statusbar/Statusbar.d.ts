import { Observer, Subject, Disposable } from '../utils';
import { StatusbarItem } from './StatusbarItem';
export declare class Statusbar extends Subject {
  protected readonly list: Map<string, StatusbarItem>;
  constructor();
  load(key: string, item: StatusbarItem): void;
  onDidLoad(
    callback: Observer<{
      key: string;
      item: StatusbarItem;
    }>
  ): Disposable;
  [Symbol.iterator](): IterableIterator<[string, StatusbarItem]>;
  get(key: string): StatusbarItem | undefined;
  forEach(callback: (value: StatusbarItem, key: string) => void): void;
}
