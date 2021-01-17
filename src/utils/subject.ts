import mitt, { Emitter, EventHandlerMap, Handler, EventType } from 'mitt';

type Observer<T> = Handler<T>;

const globalEventHandlers: EventHandlerMap = new Map();

export class Subject {
  private readonly emitter: Emitter;

  constructor(options?: { global?: boolean }) {
    const global = options?.global;
    this.emitter = mitt(global ? globalEventHandlers : undefined);
  }

  on<T = any>(type: EventType, handler: Observer<T>) {
    this.emitter.on(type, handler);
  }

  off<T = any>(type: EventType, handler: Observer<T>) {
    this.emitter.off(type, handler);
  }

  protected emit<T = any>(type: EventType, event?: T) {
    this.emitter.emit(type, event);
  }
}
