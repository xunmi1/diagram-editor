import { DisposableDelegate, Disposable } from '@/utils';
import { warn } from '@diagram-editor/shared';

export interface Command<T = any> {
  (params: T): void | Promise<void>;
}

export type CommandId = string | symbol;

export class CommandsRegistry {
  private readonly commands: Map<CommandId, Command[]>;

  constructor() {
    this.commands = new Map();
  }

  async execute<T = unknown>(commandId: CommandId, params?: T): Promise<void> {
    const list = this.commands.get(commandId);
    if (list) {
      await Promise.all(list.map(command => command(params)));
    } else {
      warn(`The command '${commandId.toString()}' does not exist.`);
    }
  }

  register<T = unknown>(commandId: CommandId, command: Command<T>): Disposable {
    const list = this.commands.get(commandId);
    if (list) {
      list.unshift(command);
    } else {
      this.commands.set(commandId, [command]);
    }

    const dispose = () => {
      const list = this.commands.get(commandId);
      if (list) {
        const index = list.indexOf(command);
        if (index > -1) list.splice(index, 1);
      }
    };

    return new DisposableDelegate(dispose);
  }

  getAll(): CommandId[] {
    return [...this.commands.keys()];
  }
}
