import { CommandId, Observer, Subject, Disposable } from '../utils';
export interface ToolbarItemOptions {
  command: CommandId;
  icon: string;
  tooltip?: string;
  checked?: boolean;
  disabled?: boolean;
}
export declare class ToolbarItem extends Subject {
  readonly command: CommandId;
  constructor(options: ToolbarItemOptions);
  get checked(): boolean;
  set checked(checked: boolean);
  get tooltip(): string | undefined;
  set tooltip(tooltip: string | undefined);
  get icon(): string;
  set icon(icon: string);
  get disabled(): boolean;
  set disabled(disabled: boolean);
  onDidChangeState(callback: Observer<void>): Disposable;
  update(): void;
}
