/*
 * ReduxMockStore
 * 테스트 환경에서의 스토어 mocking 모듈. redux-mock-store 라이브러리를 사용한다.
 */
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';

export namespace ReduxMockStore {
  /**
   * create
   * 테스트 환경 실행을 위해 mock 스토어를 생성하여 리턴한다.
   *
   * @param initialState {any}
   */
  export function create (initialState: any = {}): MockStoreEnhanced<any, any> {
    return configureMockStore()(initialState);
  }
}
