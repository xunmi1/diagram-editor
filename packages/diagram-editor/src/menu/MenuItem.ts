import { CommandId, Observer, Subject } from '../utils';
import { lazyTask } from '@diagram-editor/shared';

import { getGroups } from './utils';

export interface MenuItemOptions {
  text: string;
  extra?: string;
  command?: CommandId;
  checked?: boolean;
  visible?: boolean;
  disabled?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');
const EVENT_TYPE_CHILD_APPEND = Symbol('CHILD_APPEND');
const EVENT_TYPE_VISIBLE = Symbol('VISIBLE');
const EVENT_TYPE_CHANGE_GROUPS = Symbol('CHANGE_GROUPS');

export class MenuItem<T extends MenuItem<T> = MenuItem<any>> extends Subject {
  public readonly command?: CommandId;
  public children?: Map<string, T>;

  private _text: string;
  private _extra?: string;
  private _checked: boolean;
  private _disabled: boolean;
  private _visible: boolean;
  private _groups: string[];

  protected constructor(options: MenuItemOptions) {
    super();
    this._text = options.text;
    this.command = options.command;
    this._extra = options.extra;
    this._checked = options.checked ?? false;
    this._visible = options.visible ?? true;
    this._disabled = options.disabled ?? false;
    this._groups = [];

    this._emitUpdate = lazyTask(this._emitUpdate);
    this._emitGroups = lazyTask(this._emitGroups);
  }

  get text() {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this.update();
  }

  get extra() {
    return this._extra;
  }

  set extra(extra: string | undefined) {
    this._extra = extra;
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
    this.emit(EVENT_TYPE_VISIBLE);
  }

  /**
   * 排序分组设置, 拥有最高的优先级
   */
  get groups() {
    return [...this._groups];
  }

  set groups(groups: string[]) {
    this._groups = getGroups(groups);
    this._emitGroups();
  }

  appendChild(key: string, child: T) {
    if (!this.children) this.children = new Map();
    this.children.set(key, child);
    if (!this._groups.includes(key)) this._groups.push(key);
    this._emitGroups();
    this.emit(EVENT_TYPE_CHILD_APPEND, { key, child });
  }

  onDidAppendChild(callback: Observer<{ key: string; child: T }>) {
    return this.on(EVENT_TYPE_CHILD_APPEND, callback);
  }

  onDidChangeState(callback: Observer<void>) {
    return this.on(EVENT_TYPE_UPDATE, callback);
  }

  onDidChangeVisible(callback: Observer<void>) {
    return this.on(EVENT_TYPE_VISIBLE, callback);
  }

  onDidChangeGroups(callback: Observer<void>) {
    return this.on(EVENT_TYPE_CHANGE_GROUPS, callback);
  }

  update() {
    if (this._visible) this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE);
  }

  private _emitGroups() {
    this.emit(EVENT_TYPE_CHANGE_GROUPS);
  }
}
