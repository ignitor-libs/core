import { LazyComponent } from '../LazyComponent';

describe('LazyComponent module', () => {

  it('LazyComponent', () => {
    expect(LazyComponent(() => import('./TestComponent'))).toBeInstanceOf(Function);
  });

});
