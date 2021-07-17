import { warn } from '@diagram-editor/shared';
import { DisposableDelegate, Disposable } from './disposable';

export interface Command<T = unknown> {
  (params: T): void | Promise<void>;
}

export type CommandId = string | symbol;

export class CommandsRegistry {
  // eslint-disable-next-line
  readonly #commands: Map<CommandId, Command<any>[]>;

  constructor() {
    this.#commands = new Map();
  }

  async execute<T = unknown>(commandId: CommandId, params?: T): Promise<void> {
    const list = this.#commands.get(commandId);
    if (list) {
      await Promise.all(list.map(command => command(params)));
    } else {
      warn(`The command '${commandId.toString()}' does not exist.`);
    }
  }

  register<T = unknown>(commandId: CommandId, command: Command<T>): Disposable {
    const list = this.#commands.get(commandId);
    if (list) {
      list.unshift(command);
    } else {
      this.#commands.set(commandId, [command]);
    }

    const dispose = () => {
      const commands = this.#commands.get(commandId);
      if (commands) {
        const index = commands.indexOf(command);
        if (index > -1) commands.splice(index, 1);
      }
    };

    return new DisposableDelegate(dispose);
  }
}
