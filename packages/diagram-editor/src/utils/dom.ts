export const addEvent = <T extends EventTarget, K extends keyof WindowEventMap>(
  el: T,
  eventName: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
) => {
  el.addEventListener(eventName, listener as EventListener, options);
};

export const removeEvent = <T extends EventTarget, K extends keyof WindowEventMap>(
  el: T,
  eventName: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
) => {
  el.removeEventListener(eventName, listener as EventListener, options);
};

export const setProperty = <T extends ElementCSSInlineStyle>(
  target: T,
  propertyName: string,
  value: number | string,
  priority?: string
) => {
  target.style.setProperty(propertyName, String(value), priority);
};
