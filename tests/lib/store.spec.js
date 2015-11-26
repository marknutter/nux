import {getStore, initStore} from './../../lib/store';


describe('the Nux store', () => {
  let testStore;

  it('should allow the initilization and retrieval of a Redux store', () => {
    testStore = initStore(() => {});
    expect(testStore).toEqual('');
    expect(getStore()).toBe(testStore);
  });

});
