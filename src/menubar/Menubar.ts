import { Observer, Subject } from '@/utils';
import { ExplorerItem } from '@/explorer';

export interface MenubarItem {
  title: string;
  tooltip?: string;
  command?: string;
  key: string;
  children?: MenubarItem[];
}

const EVENT_TYPE_LOAD = Symbol('MENUBAR_ITEM_LOAD');

export class Menubar extends Subject {
  protected readonly list: Map<string, MenubarItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: ExplorerItem) {
    // @ts-ignore
    this.list.set(key, item);
    this.emit(EVENT_TYPE_LOAD, { key, item });
  }

  onDidLoad(callback: Observer<{ key: string; Item: typeof ExplorerItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
