import {init} from './../../src/index';
import {fromJS} from 'immutable';

describe('the Nux init function', () => {
  let testReducer = (state, action) => { return state};
  const testUI = {
    ui: {
      'div#app': {
        props: {
          style: {
            fontFamily: 'helvetica'
          }
        },
        'h1': {
          props: {
            style: {
              fontSize: '20px'
            }
          }
        }
      }
    }
  };


  it('should initialize with a blank UI if none is provided', () => {
    var testApp = init(testReducer)()
    expect(testApp.getState().toJS()).toEqual({ui: { div: {} }});
  });

  it('should initialize with the UI provided', () => {
    var testApp = init(testReducer)(testUI);
    expect(testApp.getState().toJS()).toEqual(testUI);
    expect(document.querySelector('div#app').outerHTML).toEqual('<div style="font-family: helvetica; " id="app"><h1 style="font-size: 20px; "></h1></div>');
  });

  it('should allow enabling of caching app state to localStorage', () => {
    localStorage.setItem = jasmine.createSpy('setItem');
    localStorage.getItem = jasmine.createSpy('getItem');
    var testApp = init(testReducer, {localStorage: 'nux'})();
    testApp.dispatch({type: 'FOO'});
    expect(localStorage.setItem).toHaveBeenCalledWith('nux', JSON.stringify({ui: {div:{}}}));
    expect(localStorage.getItem).toHaveBeenCalledWith('nux');
  });

  describe("when given a custom reducer, ", () => {
    let testApp, action, newState, providedReducer;

    beforeEach(() => {
      providedReducer = function(state, action) {
        switch(action.type) {
          case 'TEST_ACTION':
            return state.setIn(['ui', 'div'], fromJS({'$text': 'foo'}));
          default:
            return state;
        }
      }
      action = {
        type: 'TEST_ACTION'
      }
      testApp = init(providedReducer)()
    })


    it("should return a new state reduced by the provided custom action", () => {
      testApp.dispatch(action);
      expect(testApp.getState().toJS()).toEqual({
        ui: {
          div: {
            '$text': 'foo'
          }
        }
      });
    });
  });

  describe("when given custom action creators, ", () => {
    let testActionCreator, testApp, providedReducer;
    beforeEach(() => {
      providedReducer = function(state, action) { return state };
      testActionCreator = () => {};
      testApp = init(providedReducer, {actionCreators: {TEST_ACTION_CREATOR: testActionCreator }})()
    });

    it("should allow access to those action creators", () => {
      expect(testApp.getActionCreator('TEST_ACTION_CREATOR')).toBe(testActionCreator);
    });
  });

});
