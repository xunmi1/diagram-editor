export interface Command {
  (params: any): void | Promise<void>;
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

  register(commandId: string, command: Command): void {
    const list = this.commands.get(commandId);
    if (list) {
      list.push(command);
    } else {
      this.commands.set(commandId, [command]);
    }
  }

  getAll(): string[] {
    return [...this.commands.keys()];
  }
}
