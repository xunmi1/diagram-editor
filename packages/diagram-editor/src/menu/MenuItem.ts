import { lazyTask } from '@diagram-editor/shared';
import { CommandId, Observer, Subject, BaseEvents } from '../utils';

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

interface Events extends BaseEvents {
  [EVENT_TYPE_UPDATE]: void;
  [EVENT_TYPE_CHILD_APPEND]: { key: string; child: MenuItem };
  [EVENT_TYPE_VISIBLE]: void;
  [EVENT_TYPE_CHANGE_GROUPS]: void;
}

export class MenuItem extends Subject<Events> {
  public readonly command?: CommandId;

  public children?: Map<string, this>;

  #text: string;

  #extra?: string;

  #checked: boolean;

  #disabled: boolean;

  #visible: boolean;

  #groups: string[];

  protected constructor(options: MenuItemOptions) {
    super();
    this.#text = options.text;
    this.command = options.command;
    this.#extra = options.extra;
    this.#checked = options.checked ?? false;
    this.#visible = options.visible ?? true;
    this.#disabled = options.disabled ?? false;
    this.#groups = [];

    this._emitUpdate = lazyTask(this._emitUpdate);
    this._emitGroups = lazyTask(this._emitGroups);
  }

  get text() {
    return this.#text;
  }

  set text(text: string) {
    this.#text = text;
    this.update();
  }

  get extra() {
    return this.#extra;
  }

  set extra(extra: string | undefined) {
    this.#extra = extra;
    this.update();
  }

  get checked() {
    return this.#checked;
  }

  set checked(checked: boolean) {
    this.#checked = checked;
    this.update();
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(disabled: boolean) {
    this.#disabled = disabled;
    this.update();
  }

  get visible() {
    return this.#visible;
  }

  set visible(visible: boolean) {
    this.#visible = visible;
    this.emit(EVENT_TYPE_VISIBLE);
  }

  /**
   * 排序分组设置, 拥有最高的优先级
   */
  get groups() {
    return [...this.#groups];
  }

  set groups(groups: string[]) {
    this.#groups = getGroups(groups);
    this._emitGroups();
  }

  appendChild(key: string, child: this) {
    if (!this.children) this.children = new Map();
    this.children.set(key, child);
    if (!this.#groups.includes(key)) this.#groups.push(key);
    this._emitGroups();
    this.emit(EVENT_TYPE_CHILD_APPEND, { key, child });
  }

  onDidAppendChild(callback: Observer<{ key: string; child: MenuItem }>) {
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
    if (this.#visible) this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE);
  }

  private _emitGroups() {
    this.emit(EVENT_TYPE_CHANGE_GROUPS);
  }
}
