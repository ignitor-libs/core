import { ReduxMockStore } from '../ReduxMockStore';

describe('ReduxMockStore module', () => {

  it('ReduxMockStore.create', () => {
    expect(ReduxMockStore.create()).toBeInstanceOf(Object);
  });

});
