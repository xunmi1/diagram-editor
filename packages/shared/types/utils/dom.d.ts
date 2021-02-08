export type addEvent = <T extends EventTarget, K extends keyof WindowEventMap>(
  el: T,
  eventName: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
) => void;

export type removeEvent = <T extends EventTarget, K extends keyof WindowEventMap>(
  el: T,
  eventName: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
) => void;

export type setProperty = <T extends ElementCSSInlineStyle>(
  target: T,
  propertyName: string,
  value: number | string,
  priority?: string | undefined
) => void;
