import { CommandId, Observer, Subject } from '@/utils';

export interface MenubarItemOptions {
  title: string;
  command?: CommandId;
}

export interface MenubarItemState {
  checked?: boolean;
  disabled?: boolean;
}

const EVENT_TYPE_CHANGE_STATE = Symbol('CHANGE_STATE');
const EVENT_TYPE_APPEND_CHILD = Symbol('APPEND_CHILD');

export class MenubarItem extends Subject {
  public readonly title: string;
  public readonly command?: CommandId;
  public children?: Map<string, MenubarItem>;
  private _state: MenubarItemState;

  constructor(options: MenubarItemOptions) {
    super();
    this.title = options.title;
    this.command = options.command;
    this._state = {};
  }

  appendChild(key: string, child: MenubarItem) {
    if (!this.children) this.children = new Map();
    this.children.set(key, child);
    this.emit(EVENT_TYPE_APPEND_CHILD, { key, child });
  }

  onDidAppendChild(callback: Observer<{ key: string; child: MenubarItem }>) {
    return this.on(EVENT_TYPE_APPEND_CHILD, callback);
  }

  get state() {
    return { ...this._state };
  }

  set state(state: MenubarItemState) {
    this._state = { ...state };
    this.emit(EVENT_TYPE_CHANGE_STATE, this.state);
  }

  onDidChangeState(callback: Observer<MenubarItemState>) {
    return this.on(EVENT_TYPE_CHANGE_STATE, callback);
  }
}
