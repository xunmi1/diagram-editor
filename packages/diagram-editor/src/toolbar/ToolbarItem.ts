import { lazyTask } from '@diagram-editor/shared';
import { CommandId, BaseEvents, Observer, Subject } from '../utils';

export interface ToolbarItemOptions {
  command: CommandId;
  icon: string;
  tooltip?: string;
  checked?: boolean;
  disabled?: boolean;
}

const EVENT_TYPE_UPDATE = Symbol('UPDATE');

interface Events extends BaseEvents {
  [EVENT_TYPE_UPDATE]: void;
}

export class ToolbarItem extends Subject<Events> {
  public readonly command: CommandId;

  private _tooltip?: string;

  private _icon: string;

  private _disabled: boolean;

  private _checked: boolean;

  constructor(options: ToolbarItemOptions) {
    super();
    this.command = options.command;
    this._tooltip = options.tooltip;
    this._checked = options.checked ?? false;
    this._disabled = options.disabled ?? false;
    this._icon = options.icon;
    // 同一个任务队列只执行一次
    this._emitUpdate = lazyTask(this._emitUpdate);
  }

  get checked() {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
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

  set icon(icon: string) {
    this._icon = icon;
    this.update();
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._emitUpdate();
  }

  onDidChangeState(callback: Observer<void>) {
    return this.on(EVENT_TYPE_UPDATE, callback);
  }

  update() {
    this._emitUpdate();
  }

  private _emitUpdate() {
    this.emit(EVENT_TYPE_UPDATE);
  }
}
