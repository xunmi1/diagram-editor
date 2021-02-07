import { Disposable } from './disposable';

export interface Command<T = any> {
  (params: T): void | Promise<void>;
}
export declare type CommandId = string | symbol;
export declare class CommandsRegistry {
  constructor();
  execute<T = unknown>(commandId: CommandId, params?: T): Promise<void>;
  register<T = unknown>(commandId: CommandId, command: Command<T>): Disposable;
  getAll(): CommandId[];
}
