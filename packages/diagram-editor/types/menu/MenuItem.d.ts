import { CommandId, Observer, Subject, Disposable } from '../utils';
export interface MenuItemOptions {
  text: string;
  extra?: string;
  command?: CommandId;
  checked?: boolean;
  visible?: boolean;
  disabled?: boolean;
}
export declare class MenuItem<T extends MenuItem<T> = MenuItem<never>> extends Subject {
  readonly command?: CommandId;
  children?: Map<string, T>;
  protected constructor(options: MenuItemOptions);
  get text(): string;
  set text(text: string);
  get extra(): string | undefined;
  set extra(extra: string | undefined);
  get checked(): boolean;
  set checked(checked: boolean);
  get disabled(): boolean;
  set disabled(disabled: boolean);
  get visible(): boolean;
  set visible(visible: boolean);
  /**
   * 排序分组设置, 拥有最高的优先级
   */
  get groups(): string[];
  set groups(groups: string[]);
  appendChild(key: string, child: T): void;
  onDidAppendChild(
    callback: Observer<{
      key: string;
      child: T;
    }>
  ): Disposable;
  onDidChangeState(callback: Observer<void>): Disposable;
  onDidChangeVisible(callback: Observer<void>): Disposable;
  onDidChangeGroups(callback: Observer<void>): Disposable;
  update(): void;
}
