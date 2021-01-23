import mitt, { Emitter, Handler, EventType } from 'mitt';
import { DisposableDelegate, Disposable } from '@antv/x6';

export type Observer<T> = Handler<T>;

/**
 * Observer pattern & [Dispose pattern](https://wikipedia.org/wiki/Dispose_pattern)
 */
export class Subject {
  private readonly emitter: Emitter;

  constructor() {
    this.emitter = mitt();
  }

  on<T = any>(type: EventType, handler: Observer<T>): Disposable {
    this.emitter.on(type, handler);
    return new DisposableDelegate(() => this.off(type, handler));
  }

  once<T = any>(type: EventType, handler: Observer<T>) {
    const wrapper: Observer<T> = event => {
      this.off(type, wrapper);
      handler(event);
    };
    return this.on(type, wrapper);
  }

  off<T = any>(type: EventType, handler: Observer<T>) {
    this.emitter.off(type, handler);
  }

  protected emit<T = any>(type: EventType, event?: T) {
    this.emitter.emit(type, event);
  }
}
