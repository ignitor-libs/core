export namespace Events {
  export type Detail<T = any> = T;
  export type Listener<T> = (detail: Detail<T>) => void;

  /**
   * getListener
   * 리스너 등록을 위해
   *
   * @param listener {Listener<T>}
   * @returns {(event: Event) => void}
   * @private
   */
  function getListener<T> (listener: Listener<T>): (event: Event) => void {
    return (event: Event) => listener((event as CustomEvent).detail);
  }

  /**
   * on
   * 커스텀 이벤트를 등록한다.
   *
   * @param type {string}
   * @param listener {Listener<T>}
   */
  export function on<T> (type: string, listener: Listener<T>): void {
    window.addEventListener(type, getListener<T>(listener), false);
  }

  /**
   * off
   * 커스텀 이벤트를 해제한다.
   *
   * @param type {string}
   * @param listener {Listener<T>}
   */
  export function off<T> (type: string, listener: Listener<T>): void {
    window.removeEventListener(type, getListener<T>(listener));
  }

  /**
   * emit
   * 이벤트를 발생시킨다.
   *
   * @param type {string}
   * @param detail {Detail<T>}
   */
  export function emit<T> (type: string, detail: Detail<T>): void {
    window.dispatchEvent(new CustomEvent<T>(type, { detail }));
  }
}
