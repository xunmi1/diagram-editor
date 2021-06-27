import mitt, { Emitter, EventType, Handler } from 'mitt';
import { DisposableDelegate, Disposable } from './disposable';

interface Observer<T> extends Handler<T> {}
export type { EventType, Observer };

export type BaseEvents = Record<EventType, unknown>;

/**
 * Observer pattern & [Dispose pattern](https://wikipedia.org/wiki/Dispose_pattern)
 */
export class Subject<T extends BaseEvents = BaseEvents> extends Disposable {
  readonly #emitter: Emitter<T> = mitt();

  dispose() {
    this.#emitter.all.clear();
    super.dispose();
  }
  on<Key extends keyof T>(type: Key, handler: Observer<T[Key]>): Disposable {
    this.#emitter.on(type, handler);
    return new DisposableDelegate(() => this.off(type, handler));
  }

  once<Key extends keyof T>(type: Key, handler: Observer<T[Key]>) {
    const wrapper: Observer<T[Key]> = event => {
      this.off(type, wrapper);
      handler(event);
    };
    return this.on(type, wrapper);
  }

  off<Key extends keyof T>(type: Key, handler: Observer<T[Key]>) {
    this.#emitter.off(type, handler);
  }

  emit<Key extends keyof T>(...args: T[Key] extends undefined ? [Key] : [Key, T[Key]]) {
    // 如果 `Observer` 没有入参，则可以省略第二个参数
    this.#emitter.emit(args[0], args[1] as T[Key]);
  }
}
