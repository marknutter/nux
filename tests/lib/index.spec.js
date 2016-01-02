import {init} from './../../src/index';
import {fromJS} from 'immutable';

describe('the Nux init function', () => {
  let testReducer = (state, action) => { return state};
  const testUI = {
    'div#app': {
      props: {
        style: {
          fontFamily: 'helvetica'
        }
      },
      children: {
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
    var testApp = init(testReducer)
    expect(testApp.getState().toJS()).toEqual({ui: { div: {}}});
  });

  it('should initialize with the UI provided', () => {
    var testApp = init(testReducer, testUI);
    expect(testApp.getState().toJS()).toEqual({ui: testUI});
    expect(document.querySelector('div#app').outerHTML).toEqual('<div style="font-family: helvetica; " id="app"><h1 style="font-size: 20px; "></h1></div>');
  });

  it('should allow enabling of caching app state to localStorage', () => {
    localStorage.setItem = jasmine.createSpy('setItem');
    localStorage.getItem = jasmine.createSpy('getItem');
    var testApp = init(testReducer, undefined, {localStorage: true});
    testApp.dispatch({type: 'FOO'});
    expect(localStorage.setItem).toHaveBeenCalledWith('nux', JSON.stringify({div:{}}));
    expect(localStorage.getItem).toHaveBeenCalledWith('nux');
  });

});
