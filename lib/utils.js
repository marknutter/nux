/** @module utils */

import {Collection} from 'immutable';
import {renderUI} from './ui';
import createElement from 'virtual-dom/create-element';

Collection.prototype.$ = (query) => {
  return this.getIn(selector(query));
}

Collection.prototype.children = () => {
  return this.get('children');
}

Collection.prototype.toVNode = () => {
  return renderUI(this);
}

Collection.prototype.toElement = () => {
  let vNode = this.toVNode();
  if (vNode) {
    return createElement(vNode);
  }
}

Collection.prototype.toHTML = () => {
  let element = this.toElement();
  if (element) {
    return element.outerHTML;
  }
}

/**
 * Returns an array path that can be used to deeply select inside of Nux. 'children' strings
 * will be interleaved between tag strings while all nodes from 'props' and onward will be
 * added in sequence. All returned arrays will include a leading 'ui' node.
 *
 * @example
 * selector('div#foo form#bar input#baz props value');
 * // returns ['ui', 'div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props', 'value']
 *
 * @author Mark Nutter <marknutter@gmail.com>
 * @summary Generate a Nux reducer function given a custom reducer function.
 *
 * @param {String} selectorString
 * @return {Array} Path array used to deeply select inside of Immutable Nux vDOM objects
 */
export function selector(selectorString, includeRoot = true) {
  var domPathArray = selectorString.split(' props')[0].split(' ');
  var fullDomPathArray = domPathArray.reduce(function(cur, val, index) {
    return domPathArray.length === index+1 ? (val === 'children' || val === 'children' || val === 'props' ? cur : cur.concat([val])) : cur.concat([val, 'children']);
  },[]);
  var toConcat = [];
  if (selectorString.indexOf('props') > 0) {
    var propsPathArray = selectorString.split('props')[1].split(' ');
      toConcat = ['props'].concat(propsPathArray.slice(1));
  }
  return includeRoot ? ['ui'].concat(fullDomPathArray.concat(toConcat)) : fullDomPathArray.concat(toConcat);
};



