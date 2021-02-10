import { Observer, Subject, Disposable } from '../utils';
import { ToolbarItem } from './ToolbarItem';
export declare class Toolbar extends Subject {
  protected readonly list: Map<string, ToolbarItem>;
  constructor();
  load(key: string, item: ToolbarItem): void;
  onDidLoad(
    callback: Observer<{
      key: string;
      item: ToolbarItem;
    }>
  ): Disposable;
  [Symbol.iterator](): IterableIterator<[string, ToolbarItem]>;
  get(key: string): ToolbarItem | undefined;
  forEach(callback: (value: ToolbarItem, key: string) => void): void;
}
