/*
 * Events
 * 이벤트 허브 구현
 */
//export namespace Events {
//  const hub = {};
//
//  export function emit (event: string, data: any) {
//    (hub[event] || []).forEach((h: any) => h(data));
//  }
//
//  export function on (event: string, handler: Function) {
//    if (!hub[event]) {
//      hub[event] = [];
//    }
//    hub[event].push(handler);
//  }
//
//  export function off (event: string, handler: Function) {
//    const i = (hub[event] || []).findIndex((h: any) => h === handler);
//    if (i > -1) {
//      hub[event].splice(i, 1);
//    }
//    if (hub[event].length === 0) {
//      delete hub[event];
//    }
//  }
//}
