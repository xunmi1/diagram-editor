import { CommandId, Observer, Subject, lazyTask } from '@/utils';

export interface StatusbarItemOptions {
  command?: CommandId;
  text?: string;
  icon?: string;
  tooltip?: string;
  visible?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');

export class StatusbarItem extends Subject {
  public readonly command?: CommandId;
  private _text?: string;
  private _tooltip?: string;
  private _icon?: string | undefined;
  private _visible: boolean;

  constructor(options: StatusbarItemOptions = {}) {
    super();
    this.command = options.command;
    this._tooltip = options.tooltip;
    this._text = options.text;
    this._visible = options.visible ?? true;
    this._icon = options.icon;
    // 同一个任务队列只执行一次
    this._emitUpdate = lazyTask(this._emitUpdate);
  }

  get text() {
    return this._text;
  }

  set text(text: string | undefined) {
    this._text = text;
    this.update();
  }

  get tooltip() {
    return this._tooltip;
  }

  set tooltip(tooltip: string | undefined) {
    this._tooltip = tooltip;
    this.update();
  }

  get icon() {
    return this._icon;
  }

  set icon(icon: string | undefined) {
    this._icon = icon;
    this.update();
  }

  get visible() {
    return this._visible;
  }

  set visible(visible: boolean) {
    this._visible = visible;
    this._emitUpdate();
  }

  onDidChangeState(callback: Observer<void>) {
    return this.on(EVENT_TYPE_UPDATE, callback);
  }

  update() {
    if (this._visible) this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE);
  }
}
