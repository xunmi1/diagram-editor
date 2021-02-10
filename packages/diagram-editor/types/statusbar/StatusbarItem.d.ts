import { CommandId, Observer, Subject, Disposable } from '../utils';
export interface StatusbarItemOptions {
  command?: CommandId;
  text?: string;
  icon?: string;
  tooltip?: string;
  visible?: boolean;
}
export declare class StatusbarItem extends Subject {
  readonly command?: CommandId;
  constructor(options?: StatusbarItemOptions);
  get text(): string | undefined;
  set text(text: string | undefined);
  get tooltip(): string | undefined;
  set tooltip(tooltip: string | undefined);
  get icon(): string | undefined;
  set icon(icon: string | undefined);
  get visible(): boolean;
  set visible(visible: boolean);
  onDidChangeState(callback: Observer<void>): Disposable;
  update(): void;
}
