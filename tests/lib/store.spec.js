import {getStore, initStore} from './../../lib/store';


describe('the Nux store', () => {
  let testStore;

  it('should allow the initilization and retrieval of a Redux store', () => {
    testStore = initStore(() => {});
    expect(getStore()).toEqual({
      dispatch: jasmine.any(Function),
      subscribe: jasmine.any(Function),
      getState: jasmine.any(Function),
      replaceReducer: jasmine.any(Function)
    });
  });

});
