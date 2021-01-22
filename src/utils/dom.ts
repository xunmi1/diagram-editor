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
