/** @module utils */

import {Collection, Map, fromJS} from 'immutable';
import {renderUI} from './ui';
import createElement from 'virtual-dom/create-element';

Collection.prototype.$ = function $(query, setVal) {
  let pathArray = selector(query);
  let tagName = pathArray.pop();
  let nodeVal, node;

  if (setVal !== undefined) {
    nodeVal = this.setIn(selector(query), setVal);
    node = (new Map()).set(tagName, nodeVal);
    return node;
  } else {
    nodeVal = this.getIn(selector(query));
    node = (new Map()).set(tagName, nodeVal);
    node.__queryNode = this;
    node.__query = query;
    return node;
  }
}


Collection.prototype.children = function children() {
  if (this.get('children')) {
    return this.get('children');
  }
  const tagName = this.findKey(() => { return true });
  const children = this.getIn([tagName, 'children']);
  if (!children) {
    return new Map();
  }
  if (arguments[0] && typeof arguments[0] === 'object') {
    const newChildren =  children.merge(arguments[0]);
    return this.__queryNode ? this.__queryNode.mergeIn(selector(this.__query).concat('children'), newChildren) : newChildren;
  }
  return children;
}


Collection.prototype.toVNode = function toVNode(store) {
  return renderUI(store, this);
}

Collection.prototype.toElement = function toElement(store) {
  let vNode = this.toVNode(store);
  if (vNode) {
    return createElement(vNode);
  }
}

Collection.prototype.toHTML = function toHTML(store) {
  let element = this.toElement(store);
  if (element) {
    return element.outerHTML;
  }
}

Collection.prototype.props = function props() {
  const tagName = this.findKey(() => { return true });
  let props = this.getIn([tagName, 'props']);
  if (!props) {
    return new Map();
  }
  if (arguments.length === 0) {
    return props;
  }
  if (typeof arguments[0] === 'object') {
    props =  props.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && arguments[1] !== undefined) {
    props =  props.set(arguments[0], fromJS(arguments[1]));
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return props.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.mergeIn(selector(this.__query).concat('props'), props) : props;
}

Collection.prototype.propsIn = function propsIn(query) {
  const pathArray = [...selector(query), 'props'];
  let args = Array.prototype.slice.call(arguments, 1);
  const node = this.$(query).props(...args);
  return this.setIn(pathArray, node);
}

Collection.prototype.style = function style() {
  const tagName = this.findKey(() => { return true });
  let style = this.getIn([tagName, 'props', 'style']);
  if (!style) {
    return new Map();
  }
  if (arguments.length === 0) {
    return style;
  }

  if (typeof arguments[0] === 'object') {
    style = style.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
    style = style.set(arguments[0], arguments[1]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {

    return style.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.mergeIn(selector(this.__query).concat(['props', 'style']), style) : style;
}

Collection.prototype.events = function events() {
  const tagName = this.findKey(() => { return true });
  let events = this.getIn([tagName, 'props', 'events']);
  if (!events) {
    return new Map();
  }
  if (arguments.length === 0) {
    return events;
  }

  if (typeof arguments[0] === 'object') {
    events = events.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'object') {
    events = events.set(arguments[0], fromJS(arguments[1]));
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return events.get(arguments[0]);
  }

  return this.__queryNode ? this.__queryNode.mergeIn(selector(this.__query).concat(['props', 'events']), events) : events;
}

/**
 * Returns an array path that can be used to deeply select inside of Nux. 'children' strings
 * will be interleaved between tag strings while all nodes from 'props' and onward will be
 * added in sequence. All returned arrays will include a leading 'ui' node.
 *
 * @example
 * selector('div#foo form#bar input#baz props value');
 * // returns ['div#foo', 'children', 'form#bar', 'children', 'input#baz', 'props', 'value']
 *
 * @author Mark Nutter <marknutter@gmail.com>
 * @summary Generate a Nux reducer function given a custom reducer function.
 *
 * @param {String} selectorString
 * @return {Array} Path array used to deeply select inside of Immutable Nux vDOM objects
 */
export function selector(selectorString) {
  var domPathArray = selectorString.split(' props')[0].split(' ');
  var fullDomPathArray = domPathArray.reduce(function(cur, val, index) {
    if (val === 'children') {
      return cur;
    }
    if (val === 'ui' || val === 'props') {
      return cur.concat([val]);
    } else {
      return domPathArray.length === index+1 ? cur.concat([val]) : cur.concat([val, 'children']);
    }
  },[]);
  var toConcat = [];
  if (selectorString.indexOf('props') > 0) {
    var propsPathArray = selectorString.split('props')[1].split(' ');
      toConcat = ['props'].concat(propsPathArray.slice(1));
  }
  return fullDomPathArray.concat(toConcat);
};



