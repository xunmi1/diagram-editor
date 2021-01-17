import mitt, { Emitter, Handler, EventType } from 'mitt';

type Observer<T> = Handler<T>;

export class Subject {
  private readonly emitter: Emitter;

  constructor() {
    this.emitter = mitt();
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
