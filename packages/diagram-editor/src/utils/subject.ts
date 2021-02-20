import mitt, { Emitter, EventType } from 'mitt';
import { DisposableDelegate, Disposable } from './disposable';

export type Observer<T> = (event: T) => void;

/**
 * Observer pattern & [Dispose pattern](https://wikipedia.org/wiki/Dispose_pattern)
 */
export class Subject extends Disposable {
  private readonly _emitter: Emitter;

  constructor() {
    super();
    this._emitter = mitt();
  }

  dispose() {
    this._emitter.all.clear();
    super.dispose();
  }

  on<T = unknown>(type: EventType, handler: Observer<T>): Disposable {
    // @ts-ignore
    this._emitter.on(type, handler);
    return new DisposableDelegate(() => this.off(type, handler));
  }

  once<T = unknown>(type: EventType, handler: Observer<T>) {
    const wrapper: Observer<T> = event => {
      this.off(type, wrapper);
      handler(event);
    };
    return this.on(type, wrapper);
  }

  off<T = unknown>(type: EventType, handler: Observer<T>) {
    // @ts-ignore
    this._emitter.off(type, handler);
  }

  emit<T = unknown>(type: EventType, event?: T) {
    this._emitter.emit(type, event);
  }
}
