import {fromJS, Map, List, Iterable} from 'immutable';
import h from 'virtual-dom/h';
import {selector} from './../../lib/utils';
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
        expect(tree.$('div#foo div.bar span.baz').toJS()).toEqual({
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
        expect(tree.$('div#foo').children().toJS()).toEqual({
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
        expect(tree.$('div#foo input.biz').toVNode(mockStore)).toEqual(
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
        expect(tree.$('div#foo div.bar span.baz').toElement(mockStore)).toEqual(expectedEl);
      });

    });

    describe("toHTML() method", () => {

      it("should define a method toHTML() which returns a Nux vDom node as HTML", () => {
        expect(tree.$('div#foo div.bar span.baz').toHTML(mockStore)).toEqual('<span style="color: white; " class="baz"></span>');
      });

    });

    describe("props() method", () => {

      it("should return a Nux vDom node's props", () => {
        expect(tree.$('div#foo div.bar span.baz').props().toJS()).toEqual({
          style: {
            color: 'white'
          }
        });
      });

    });

    describe("propsIn() method", () => {

      it("should deeply set a Nux vDom node's props", () => {
        const expectedState = tree.setIn(['ui', 'div#foo', 'children', 'input.biz', 'props', 'placeholder'], 'type here..');
        expect(tree.propsIn('div#foo input.biz', 'placeholder', 'type here..').toJS()).toEqual(expectedState.toJS());
      });

    });

    describe("style() method", () => {

      it("should return a Nux vDom node's styles when no parameters are provided", () => {
        expect(tree.$('div#foo div.bar span.baz').style().toJS()).toEqual({
          color: 'white'
        });
      });

      it("should return blank Map when no events are found", () => {
        expect(tree.$('div#foo div.bar').style().toJS()).toEqual({});
      });

      it("should return a Nux vDom node's style when the style name is provided", () => {
        expect(tree.$('div#foo div.bar span.baz').style('color')).toEqual('white');
      });

      it("should allow setting of a Nux vDom node's style", () => {
        expect(tree.$('div#foo div.bar span.baz').style('fontFamily', 'helvetica').toJS()).toEqual({
          color: 'white',
          fontFamily: 'helvetica'
        });
      });


      it("should allow setting of multiple Nux vDom node styles", () => {
        expect(tree.$('div#foo div.bar span.baz').style({'fontFamily': 'helvetica', fontSize: '12px'}).toJS()).toEqual({
          color: 'white',
          fontFamily: 'helvetica',
          fontSize: '12px'
        });
      });

      it("should return unmodified Nux vDom node styles if parameters are invalid", () => {
        expect(tree.$('div#foo div.bar span.baz').style('blah', {foo: 'bar'}).toJS()).toEqual({
          color: 'white'
        });
        expect(tree.$('div#foo div.bar span.baz').style(5, 'foo').toJS()).toEqual({
          color: 'white'
        });
      });

    });

    describe("styleIn() method", () => {

      it("should allow deep setting of a Nux vDom node's style", () => {
        const expectedState = tree.setIn(['ui', 'div#foo', 'children', 'div.bar', 'children', 'span.baz', 'props', 'style', 'fontFamily'], 'helvetica');
        expect(tree.styleIn('div#foo div.bar span.baz', 'fontFamily', 'helvetica').toJS()).toEqual(expectedState.toJS());
      });

    });

    describe("events() method", () => {

      it("should return a Nux vDom node's events when no parameters are provided", () => {
        expect(tree.$('div#foo input.biz').events().toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
      });

      it("should return blank Map when no events are found", () => {
        expect(tree.$('div#foo div.bar').events().toJS()).toEqual({});
      });

      it("should return a Nux vDom node's events when the event name is provided", () => {
        expect(tree.$('div#foo input.biz').events('ev-click').toJS()).toEqual({
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
        expect(tree.$('div#foo input.biz').events('ev-blur', testEvent).toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          },
          'ev-blur': {
            dispatch: {
              type: 'BLUR'
            }
          }
        });
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
        expect(tree.$('div#foo input.biz').events(testEvents).toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          },
          'ev-blur': {
            dispatch: {
              type: 'BLUR'
            }
          },
          'ev-hover': {
            dispatch: {
              type: 'HOVER'
            }
          }
        });
      });

      it("should return unmodified Nux vDom node events if parameters are invalid", () => {
        expect(tree.$('div#foo input.biz').events('blah', 'foo').toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
        expect(tree.$('div#foo input.biz').events(5, 'foo').toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
        expect(tree.$('div#foo input.biz').events(5).toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          }
        });
      });

    });


    describe("eventsIn() method", () => {

      it("should allow deep setting of a Nux vDom node's events", () => {
        const testEvent = {
          dispatch: {
            type: 'BLUR'
          }
        }
        const expectedState = tree.setIn(['ui', 'div#foo', 'children', 'input.biz', 'props', 'events', 'ev-blur'], fromJS(testEvent))
        expect(tree.$('div#foo input.biz').events('ev-blur', testEvent).toJS()).toEqual({
          'ev-click': {
            dispatch: {
              type: 'CLICK'
            }
          },
          'ev-blur': {
            dispatch: {
              type: 'BLUR'
            }
          }
        });
      });

    });


  });

});
