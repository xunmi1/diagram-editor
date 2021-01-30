import { CommandId, Observer, Subject, lazyTask } from '@/utils';

export interface MenubarItemOptions {
  title: string;
  command?: CommandId;
  checked?: boolean;
  disabled?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');
const EVENT_TYPE_CHILD_APPEND = Symbol('CHILD_APPEND');

export class MenubarItem extends Subject {
  public readonly title: string;
  public readonly command?: CommandId;
  public children?: Map<string, MenubarItem>;

  private _checked: boolean;
  private _disabled: boolean;

  constructor(options: MenubarItemOptions) {
    super();
    this.title = options.title;
    this.command = options.command;
    this._checked = options.checked ?? false;
    this._disabled = options.disabled ?? false;

    this._emitUpdate = lazyTask(this._emitUpdate);
  }

  get checked() {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
    this.change();
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.change();
  }

  appendChild(key: string, child: MenubarItem) {
    if (!this.children) this.children = new Map();
    this.children.set(key, child);
    this.emit(EVENT_TYPE_CHILD_APPEND, { key, child });
  }

  onDidAppendChild(callback: Observer<{ key: string; child: MenubarItem }>) {
    return this.on(EVENT_TYPE_CHILD_APPEND, callback);
  }

  onDidChangeState(callback: Observer<MenubarItem>) {
    return this.on(EVENT_TYPE_UPDATE, callback);
  }

  change() {
    this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE, this);
  }
}
