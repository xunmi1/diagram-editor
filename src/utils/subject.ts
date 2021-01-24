import mitt, { Emitter, EventType } from 'mitt';
import { DisposableDelegate, Disposable } from '@/utils';

export type Observer<T> = (event: T) => void;

/**
 * Observer pattern & [Dispose pattern](https://wikipedia.org/wiki/Dispose_pattern)
 */
export class Subject {
  private readonly emitter: Emitter;

  constructor() {
    this.emitter = mitt();
  }

  on<T = any>(type: EventType, handler: Observer<T>): Disposable {
    // @ts-ignore
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
    // @ts-ignore
    this.emitter.off(type, handler);
  }

  emit<T = any>(type: EventType, event?: T) {
    this.emitter.emit(type, event);
  }
}
