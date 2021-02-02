import { CommandId, Observer, Subject, lazyTask } from '@/utils';
import { DiagramEditor, Menu } from '@/interfaces';

export interface ContextMenuItemOptions {
  text: string;
  command?: CommandId;
  checked?: boolean;
  visible?: boolean;
  disabled?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');
const EVENT_TYPE_CHILD_APPEND = Symbol('CHILD_APPEND');

export class ContextMenuItem extends Subject implements Menu<ContextMenuItem> {
  public readonly command?: CommandId;
  public children?: Map<string, ContextMenuItem>;

  private _text: string;
  private _checked: boolean;
  private _disabled: boolean;
  private _visible: boolean;

  constructor(options: ContextMenuItemOptions) {
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

  activate?(editor: DiagramEditor): boolean;

  appendChild(key: string, child: ContextMenuItem) {
    if (!this.children) this.children = new Map();
    this.children.set(key, child);
    this.emit(EVENT_TYPE_CHILD_APPEND, { key, child });
  }

  onDidAppendChild(callback: Observer<{ key: string; child: ContextMenuItem }>) {
    return this.on(EVENT_TYPE_CHILD_APPEND, callback);
  }

  onDidChangeState(callback: Observer<ContextMenuItem>) {
    return this.on(EVENT_TYPE_UPDATE, callback);
  }

  update() {
    if (this._visible) this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE, this);
  }
}
