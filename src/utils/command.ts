import { Disposable, DisposableDelegate } from '@antv/x6';

export interface Command<T = any> {
  (params: T): void | Promise<void>;
}

export class CommandsRegistry {
  private readonly commands: Map<string, Command[]>;

  constructor() {
    this.commands = new Map();
  }

  async execute(commandId: string, params: any): Promise<void> {
    const list = this.commands.get(commandId);
    if (list) {
      await Promise.all(list.map(command => command(params)));
    }
  }

  register<T = any>(commandId: string, command: Command<T>): Disposable {
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

  getAll(): string[] {
    return [...this.commands.keys()];
  }
}
