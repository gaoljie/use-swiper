import { useEffect } from "react";

export default function useEventBinding<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(
  container: T | null,
  type: K,
  callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): (this: HTMLElement, ev: HTMLElementEventMap[K]) => any {
  useEffect(() => {
    if (!container) return;
    container.addEventListener(type, callback);
    return () => container.removeEventListener(type, callback);
  }, [container, callback, type]);

  return callback;
}
