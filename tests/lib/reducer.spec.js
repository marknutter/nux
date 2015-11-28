import {reducer} from './../../lib/reducer';
import {Map, fromJS, Iterable, OrderedMap} from 'immutable';


describe('the Nux core reducer, when provided a separate reducer,', () => {

  let testReducer;
  let providedReducer = function(state, action) {
    switch(action.type) {
      case 'TEST_ACTION':
        return Map({foo: 'bar'});
      default:
        return state;
    }
  }

  beforeEach(() => {
    testReducer = reducer(providedReducer);
  });

  describe("when handling an action that is not defined,", () => {
    const initialState = Map();
    let action, newState;

    beforeEach(() => {
      action = {
        type: 'UNDEFINED_ACTION'
      }
      newState = testReducer(initialState, action);
    })

    it ("should return the same state", () => {
      expect(newState.toJS()).toEqual({});
    });
  });

  describe("when handling the provided action 'TEST_ACTION', ", () => {
    const initialState = Map();
    let action, newState;

    beforeEach(() => {
      action = {
        type: 'TEST_ACTION'
      }
      newState = testReducer(initialState, action);
    })


    it ("should return a new state reduced by the provided action", () => {
      expect(newState.toJS()).toEqual({
        foo: 'bar'
      });
    });
  });

  describe('when handling the core action', () => {

    describe('_LOAD_INITIAL_UI,', () => {
      const initialState = {
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
      let action, newState;

      beforeEach(() => {
        action = {
          type: '_LOAD_INITIAL_UI',
          ui: initialState
        }
        newState = testReducer(Map(), action);
      })


      it ("should return a new state that is an immutable version of the given object at the root node 'ui'", () => {
        expect(newState.toJS()).toEqual({ui: initialState});
      });

      it ("should return a new state with all nested objects converted into OrderedMaps", () => {
        expect(OrderedMap.isOrderedMap(newState.getIn(['ui', 'div#app', 'children']))).toBe(true);
      });

    });

    describe('_UPDATE_INPUT_VALUE,', () => {
      const initialState = fromJS({
        'input': {
          props: {
            placeholder: 'add new foo'
          }
        }
      });
      let action, newState;

      beforeEach(() => {
        action = {
          type: '_UPDATE_INPUT_VALUE',
          pathArray: ['input'],
          val: 'foo'
        }
        newState = testReducer(initialState, action);
      })


      it ("should return new state with the 'value' prop *set* to 'foo'", () => {
        expect(newState.toJS()).toEqual({
          'input': {
            props: {
              placeholder: 'add new foo',
              value: 'foo'
            }
          }
        });
      });

      it ("should return new state with the 'value' prop *updated* to 'bar'", () => {
        newState = testReducer(newState, {
          type: '_UPDATE_INPUT_VALUE',
          pathArray: ['input'],
          val: 'bar'
        });
        expect(newState.toJS()).toEqual({
          'input': {
            props: {
              placeholder: 'add new foo',
              value: 'bar'
            }
          }
        });
      });

    });

  });

});
