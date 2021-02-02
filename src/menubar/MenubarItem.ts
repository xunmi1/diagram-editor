import { CommandId, Observer, Subject, lazyTask } from '@/utils';
import { Menu } from '@/interfaces';

export interface MenubarItemOptions {
  text: string;
  command?: CommandId;
  checked?: boolean;
  disabled?: boolean;
  visible?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');
const EVENT_TYPE_CHILD_APPEND = Symbol('CHILD_APPEND');

export class MenubarItem extends Subject implements Menu<MenubarItem> {
  public readonly command?: CommandId;
  public children?: Map<string, MenubarItem>;

  private _text: string;
  private _checked: boolean;
  private _disabled: boolean;
  private _visible: boolean;

  constructor(options: MenubarItemOptions) {
    super();
    this._text = options.text;
    this.command = options.command;
    this._checked = options.checked ?? false;
    this._visible = options.visible ?? true;
    this._disabled = options.disabled ?? false;

    this._emitUpdate = lazyTask(this._emitUpdate);
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this.update();
  }

  get checked() {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
    this.update();
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.update();
  }

  get visible() {
    return this._visible;
  }

  set visible(visible: boolean) {
    this._visible = visible;
    this._emitUpdate();
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

  update() {
    if (this._visible) this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE, this);
  }
}
