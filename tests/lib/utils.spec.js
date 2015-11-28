import {selector} from './../../lib/utils';


describe('the Nux utility ', () => {
  let testStore;
  describe('selector()', () => {

    it("should turn a selector string into a path array with 'children' strings separating any tags", () => {
      expect(selector('div#foo form#bar input#baz'))
        .toEqual(['ui', 'div#foo', 'children', 'form#bar', 'children', 'input#baz']);
    });

    it("should return a trailing 'children' string if provided", () => {
      expect(selector('div#foo form#bar input#baz children'))
        .toEqual(['ui', 'div#foo', 'children', 'form#bar', 'children', 'input#baz', 'children']);
    });

    it("should return props without interweaving 'children' strings", () => {
      expect(selector('div#foo form#bar input#baz props value'))
        .toEqual(['ui', 'div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props', 'value']);
    });

    it("should return trailing 'props' string correctly", () => {
      expect(selector('div#foo form#bar input#baz props'))
        .toEqual(['ui', 'div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props']);
    });

  });

});
