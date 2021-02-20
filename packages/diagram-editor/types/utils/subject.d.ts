import { EventType } from 'mitt';
import { Disposable } from './disposable';
export declare type Observer<T> = (event: T) => void;
/**
 * Observer pattern & [Dispose pattern](https://wikipedia.org/wiki/Dispose_pattern)
 */
export declare class Subject extends Disposable {
  constructor();
  dispose(): void;
  on<T = unknown>(type: EventType, handler: Observer<T>): Disposable;
  once<T = unknown>(type: EventType, handler: Observer<T>): Disposable;
  off<T = unknown>(type: EventType, handler: Observer<T>): void;
  emit<T = unknown>(type: EventType, event?: T): void;
}
