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


Collection.prototype.children = function() {
  const tagName = this.findKey(() => { return true });
  let children = this.getIn([tagName, 'children']) || this.get('children') || new Map();
  if (arguments.length === 0) {
    return children;
  }
  if (arguments[0] && typeof arguments[0] === 'object') {
    children = arguments[0];
  } else if (typeof arguments[0] === 'string' && arguments[1] !== undefined) {
    children = arguments[1] === null ? children.delete(arguments[0]) : children.set(arguments[0], arguments[1]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return children.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat('children'), children) : this.setIn([tagName, 'children'], children);
}

Collection.prototype.toNode = function toNode(tagName) {
  return (new Map()).set(tagName, this)
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

Collection.prototype.props = function() {
  const tagName = this.findKey(() => { return true });
  let props = this.getIn([tagName, 'props']) || new Map();
  if (arguments.length === 0) {
    return props;
  }
  if (typeof arguments[0] === 'object') {
    props =  props.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && arguments[1] !== undefined) {
    props =  arguments[1] === null ? props.delete(arguments[0]) : props.set(arguments[0], fromJS(arguments[1]));
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return props.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat('props'), props) : this.setIn([tagName, 'props'], props);
}

Collection.prototype.style = function() {
  const tagName = this.findKey(() => { return true });
  let style = this.getIn([tagName, 'props', 'style']) || new Map();
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
  } else if (typeof arguments[0] === 'string' && arguments[1] === null) {
    style = style.delete(arguments[0]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {

    return style.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat(['props', 'style']), style) : this.setIn([tagName, 'props', 'style'], style);
}

Collection.prototype.events = function() {
  const tagName = this.findKey(() => { return true });
  let events = this.getIn([tagName, 'props', 'events']) || new Map();
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
  } else if (typeof arguments[0] === 'string' && arguments[1] === null) {
    events = events.delete(arguments[0]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return events.get(arguments[0]);
  }

  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat(['props', 'events']), events) : this.setIn([tagName, 'props', 'events'], events);
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



