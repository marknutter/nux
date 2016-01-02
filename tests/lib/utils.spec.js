import {fromJS, Map, List, Iterable} from 'immutable';
import h from 'virtual-dom/h';
import {selector} from './../../src/utils';
import {createStore} from 'redux';

describe('the Nux utility ', () => {

  let mockStore;

  beforeEach(() => {
    mockStore = createStore((state) => { return state });
    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockStore.getState = jasmine.createSpy('getState');
  });

  describe('selector()', () => {

    it("should turn a selector string into a path array with 'children' strings separating any tags", () => {
      expect(selector('div#foo form#bar input#baz'))
        .toEqual(['div#foo', 'children', 'form#bar', 'children', 'input#baz']);
    });

    it("should return a trailing 'children' string if provided", () => {
      expect(selector('div#foo form#bar input#baz children'))
        .toEqual(['div#foo', 'children', 'form#bar', 'children', 'input#baz', 'children']);
    });

    it("should return props without interweaving 'children' strings", () => {
      expect(selector('div#foo form#bar input#baz props value'))
        .toEqual(['div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props', 'value']);
    });

    it("should return trailing 'props' string correctly", () => {
      expect(selector('div#foo form#bar input#baz props'))
        .toEqual(['div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props']);
    });

  });

  describe("the Collection.prototype's", () => {
    let tree;
    beforeEach(() => {
      tree = fromJS({
        ui: {
          'div#foo': {
            children: {
              'div.bar': {
                children: {
                  'span.baz': {
                    props: {
                      style: {
                        color: 'white'
                      }
                    }
                  }
                }
              },
              'input.biz': {
                props: {
                  events: {
                    'ev-click': {
                      dispatch: {
                        type: 'CLICK'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
    });

    describe("$() method", () => {

      it("should define the method $() which should allow the retrieval of nested data in a Nux vDom object", () => {
        expect(tree.$('ui div#foo div.bar span.baz').toJS()).toEqual({
          'span.baz': {
            props: {
              style: {
                color: 'white'
              }
            }
          }
        });
      });

    });

    describe("children() method", () => {

      it("should define the method children() which should allow the retrieval children of a vDom node", () => {
        expect(tree.$('ui div#foo').children().toJS()).toEqual({
          'div.bar': {
            children: {
              'span.baz': {
                props: {
                  style: {
                    color: 'white'
                  }
                }
              }
            }
          },
          'input.biz': {
            props: {
              events: {
                'ev-click': {
                  dispatch: {
                    type: 'CLICK'
                  }
                }
              }
            }
          }
        });
      });

    });

    describe("toVnode() method", () => {

      it("should define a method toVNode() which returns a Nux vDom node", () => {
        expect(tree.$('ui div#foo input.biz').toVNode(mockStore)).toEqual(
          h('input.biz', {
              'ev-click': jasmine.any(Function),
              'ev-keyup': jasmine.any(Function)
            })
        )
      });

    });

    describe("toElement() method", () => {

      it("should define a method toElement() which returns a Nux vDom node as a normal DOM element", () => {
        let expectedEl = document.createElement('span');
        expectedEl.className = 'baz';
        expectedEl.style.color = 'white';
        expect(tree.$('ui div#foo div.bar span.baz').toElement(mockStore)).toEqual(expectedEl);
      });

    });

    describe("toHTML() method", () => {

      it("should define a method toHTML() which returns a Nux vDom node as HTML", () => {
        expect(tree.$('ui div#foo div.bar span.baz').toHTML(mockStore)).toEqual('<span style="color: white; " class="baz"></span>');
      });

    });


    describe("props() method", () => {

      it("should return a Nux vDom node's props", () => {
        expect(tree.$('ui div#foo div.bar span.baz').props().toJS()).toEqual({
          style: {
            color: 'white'
          }
        });
      });

      it("should return blank Map when no props are found", () => {
        expect(tree.$('ui div#foo div.bar').props().toJS()).toEqual({});
      });

      it("should return a Nux vDom node's props when the event name is provided", () => {
        expect(tree.$('ui div#foo input.biz').props('events').toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
      });

      it("should allow setting of a Nux vDom node's props", () => {
        let expectedState = tree.setIn(['ui', 'div#foo', 'children', 'input.biz', 'props', 'placeholder'], 'type here');
        expect(tree.$('ui div#foo input.biz').props('placeholder', 'type here').toJS()).toEqual(expectedState.toJS());
      });

      it("should allow setting of multiple Nux vDom node props", () => {
        const testprops = {
          'placeholder': 'type here',
          'value': 'hello world'
        }
        let expectedState = tree.mergeIn(['ui', 'div#foo', 'children', 'input.biz', 'props'], Map(testprops));
        expect(tree.$('ui div#foo input.biz').props(testprops).toJS()).toEqual(expectedState.toJS());
      });

      it("should return unmodified Nux vDom node props if parameters are invalid", () => {
        expect(tree.$('ui div#foo input.biz').props(null, 'foo').toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo input.biz').props(null).toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo input.biz').props(5, 'foo').toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo input.biz').props(5).toJS()).toEqual(tree.toJS());
      });

    });


    describe("style() method", () => {

      it("should return a Nux vDom node's styles when no parameters are provided", () => {
        expect(tree.$('ui div#foo div.bar span.baz').style().toJS()).toEqual({
          color: 'white'
        });
      });

      it("should return blank Map when no events are found", () => {
        expect(tree.$('ui div#foo div.bar').style().toJS()).toEqual({});
      });

      it("should return a Nux vDom node's style when the style name is provided", () => {
        expect(tree.$('ui div#foo div.bar span.baz').style('color')).toEqual('white');
      });

      it("should allow setting of a Nux vDom node's style", () => {
        let expectedState = tree.setIn(['ui', 'div#foo', 'children', 'div.bar', 'children', 'span.baz', 'props', 'style', 'fontFamily'], 'helvetica')
        expect(tree.$('ui div#foo div.bar span.baz').style('fontFamily', 'helvetica').toJS()).toEqual(expectedState.toJS());
      });


      it("should allow setting of multiple Nux vDom node styles", () => {
        let expectedState = tree.mergeIn(['ui', 'div#foo', 'children', 'div.bar', 'children', 'span.baz', 'props', 'style'], Map({'fontFamily': 'helvetica', fontSize: '12px'}));
        expect(tree.$('ui div#foo div.bar span.baz').style({'fontFamily': 'helvetica', fontSize: '12px'}).toJS()).toEqual(expectedState.toJS());
      });

      it("should return unmodified Nux vDom node styles if parameters are invalid", () => {
        expect(tree.$('ui div#foo div.bar span.baz').style('blah', {foo: 'bar'}).toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo div.bar span.baz').style(5, 'foo').toJS()).toEqual(tree.toJS());
      });

    });

    describe("events() method", () => {

      it("should return a Nux vDom node's events when no parameters are provided", () => {
        expect(tree.$('ui div#foo input.biz').events().toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
      });

      it("should return blank Map when no events are found", () => {
        expect(tree.$('ui div#foo div.bar').events().toJS()).toEqual({});
      });

      it("should return a Nux vDom node's events when the event name is provided", () => {
        expect(tree.$('ui div#foo input.biz').events('ev-click').toJS()).toEqual({
          dispatch: {
            type: 'CLICK'
          }
        });
      });

      it("should allow setting of a Nux vDom node's events", () => {
        const testEvent = {
          dispatch: {
            type: 'BLUR'
          }
        }
        let expectedState = tree.setIn(['ui', 'div#foo', 'children', 'input.biz', 'props', 'events', 'ev-blur'], Map(testEvent));
        expect(tree.$('ui div#foo input.biz').events('ev-blur', testEvent).toJS()).toEqual(expectedState.toJS());
      });

      it("should allow setting of multiple Nux vDom node events", () => {
        const testEvents = {
          'ev-hover': {
            dispatch: {
              type: 'HOVER'
            }
          },
          'ev-blur': {
            dispatch: {
              type: 'BLUR'
            }
          }
        }
        let expectedState = tree.mergeIn(['ui', 'div#foo', 'children', 'input.biz', 'props', 'events'], Map(testEvents));
        expect(tree.$('ui div#foo input.biz').events(testEvents).toJS()).toEqual(expectedState.toJS());
      });

      it("should return unmodified Nux vDom node events if parameters are invalid", () => {
        expect(tree.$('ui div#foo input.biz').events('blah', 'foo').toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo input.biz').events(5, 'foo').toJS()).toEqual(tree.toJS());
        expect(tree.$('ui div#foo input.biz').events(5).toJS()).toEqual(tree.toJS());
      });

    });


  });

});
