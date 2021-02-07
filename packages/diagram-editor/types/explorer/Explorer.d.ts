import { Subject, Observer, Disposable } from '../utils';
import type { ExplorerItem } from './ExplorerItem';
export declare class Explorer extends Subject {
  protected readonly list: Map<string, ExplorerItem>;
  constructor();
  load(key: string, item: ExplorerItem): void;
  onDidLoad(
    callback: Observer<{
      key: string;
      item: ExplorerItem;
    }>
  ): Disposable;
  [Symbol.iterator](): IterableIterator<[string, ExplorerItem]>;
  get(key: string): ExplorerItem | undefined;
  forEach(callback: (value: ExplorerItem, key: string) => void): void;
}
