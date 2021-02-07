import { Observer, Subject, Disposable } from '../utils';
import type { ControllerItem } from './ControllerItem';
export declare class Controller extends Subject {
  protected readonly list: Map<string, ControllerItem>;
  constructor();
  load(key: string, item: ControllerItem): void;
  onDidLoad(
    callback: Observer<{
      key: string;
      item: ControllerItem;
    }>
  ): Disposable;
  [Symbol.iterator](): IterableIterator<[string, ControllerItem]>;
  get(key: string): ControllerItem | undefined;
  forEach(callback: (value: ControllerItem, key: string) => void): void;
}
