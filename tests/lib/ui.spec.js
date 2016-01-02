import {fromJS, Map, List, Iterable} from 'immutable';
import h from 'virtual-dom/h';
import {createStore} from 'redux';
import {renderUI} from './../../src/ui';



describe('the Nux core ui renderer,', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createStore((state) => { return state });
    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockStore.getState = jasmine.createSpy('getState');
  });

  describe('when given a basic Nux DOM Object,', () => {

    let renderedUI;
    const testUI = fromJS({
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
          },
          'span': {
            children: {
              $text: 'foo'
            }
          }
        }
      }
    });

    renderedUI = renderUI(mockStore, testUI);

    it('should convert a Nux DOM object into a virtual DOM object', () => {
      expect(renderedUI).toEqual(
        h('div#app', {style: {
            fontFamily: 'helvetica'
          }}, [h('h1', {style: {
            fontSize: '20px'
          }}),
            h('span', ['foo'])])
      );
    });

  });

  describe('when given a Nux DOM Object with an input field,', () => {

      let renderedUI;
      const testUI = fromJS({
        'form#test': {
          children: {
            'input': {
              props: {
                placeholder: 'enter stuff'
              }
            }
          }
        }
      });

    beforeEach(() => {
      renderedUI = renderUI(mockStore, testUI);
    });

    it('should add event handling to the input field object', () => {
      expect(renderedUI).toEqual(
        h('form#test',
          h('input',
            {
              placeholder: 'enter stuff',
              'ev-keyup': jasmine.any(Function)
            }
          )
        )
      );
    });

    it("should dispatch an _UPDATE_INPUT_VALUE action when the input callback function is invoked", () => {
      let mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        target: {
          value: 'foo'
        }
      };
      renderedUI.children[0].properties['ev-keyup'].value(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: '_UPDATE_INPUT_VALUE',
        val: 'foo',
        pathArray: ['ui', 'form#test', 'children', 'input']
      });
    });


  });

  describe('when given a Nux DOM Object with given a node containing a custom event,', () => {

    let renderedUI;
    const testUI = fromJS({
      'div#test': {
        props: {
          events: {
            'ev-click': {
              dispatch: {
                type: 'CUSTOM_ACTION'
              }
            }
          }
        }
      }
    });

    beforeEach(() => {
      renderedUI = renderUI(mockStore, testUI);
    });

    it('should add event handling to the node', () => {
      expect(renderedUI).toEqual(h('div#test', { 'ev-click': jasmine.any(Function) }));
    });

    it("should dispatch a _CUSTOM_ACTION action when the given node's callback function is invoked", () => {
      let mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault')
      };
      renderedUI.properties['ev-click'].value(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'CUSTOM_ACTION', event: mockEvent });
    });


  });


});
