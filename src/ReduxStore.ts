/*
 * ReduxStore
 * Redux 스토어 생성을 위한 모듈.
 */
import { Provider as ReactReduxProvider } from 'react-redux';
import {
  applyMiddleware,
  createStore,
  compose,
  Dispatch,
  Middleware,
  Reducer,
  CombinedState,
  Store as StoreOrigin,
  Unsubscribe, Action, AnyAction,
} from 'redux';

export namespace ReduxStore {
  // Store는 redux의 Store를 제공하기 위함
  export type Store<S = any, A extends Action = AnyAction> = StoreOrigin<S, A>;
  export type Option<S = any> = {
    reducers: Reducer;
    initialState?: CombinedState<S>;
    middlewares?: Middleware[];
  };
  export type ConnectedStore = {
    dispatch: Dispatch;
    rootState: any;
  };

  // Provider는 react-redux의 Provider 컴포넌트를 제공하기 위함
  export const Provider = ReactReduxProvider;

  let store: Store | null = null;

  /**
   * create
   * 생성된 Redux Store를 리턴하여 provider에 전달 및 코드 상에서 스토어 조작이 가능하다.
   * If your app runs under SSR, you must create Redux-store after component was mounted!
   * (window object would be undefined)
   *
   * @param storeOptions {Option}
   * @returns {Store}
   */
  export function create (storeOptions: Option): Store {
    if (store) {
      // 이미 생성되어 있다면 replace 처리
      store.replaceReducer(storeOptions.reducers);
    } else {
      // 신규 store 생성
      const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

      // 미들웨어 초기화
      if (!storeOptions.middlewares) {
        storeOptions.middlewares = <Middleware[]>[];
      }

      store = createStore(
        storeOptions.reducers,
        storeOptions.initialState,
        composeEnhancers(applyMiddleware(...storeOptions.middlewares)),
      );
    }

    return store;
  }

  /**
   * setSubscribe
   * store의 subscribe 함수를 이용하여 스토어의 변화를 감지하게 한다.
   *
   * @param listener {function}
   * @returns {Unsubscribe}
   */
  export function setSubscribe (listener: () => void): Unsubscribe {
    if (store) {
      return store.subscribe(listener);
    } else {
      throw new Error('Redux Store was not created yet!');
    }
  }

  /**
   * getConnected
   * store의 dispatch 함수와 state
   *
   * @returns {ConnectedStore}
   */
  export function getConnected (): ConnectedStore {
    if (store) {
      return {
        dispatch: store.dispatch,
        rootState: store.getState(),
      };
    } else {
      throw new Error('Redux Store was not created yet!');
    }
  }

  /**
   * suspenseState
   * 지정된 timeout 시간동안 스토어 오브젝트가 존재하게 될 때까지 대기 후 해당 오브젝트를 리턴한다.
   *
   * @param decisor {function}
   * @param timeout {number}
   * @returns {Promise<any>}
   */
  export function suspenseState (decisor: (state: any) => any, timeout: number = 5000): Promise<any> {
    let unsubscribe: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout;

    return new Promise((resolve, reject) => {
      const subscribeListener = () => {
        const rootState: any = store?.getState();

        if (decisor(rootState)) {
          if (unsubscribe) {
            unsubscribe();
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          resolve(rootState);
        }
      };

      subscribeListener(); // subscribe 전에 스토어에 데이터가 있는지 한 번 확인한다.
      unsubscribe = setSubscribe(subscribeListener);

      timeoutId = setTimeout(() => {
        unsubscribe?.();
        reject(new Error('Cannot get stand-by data of state by timeout!'));
      }, timeout);
    });
  }
}
