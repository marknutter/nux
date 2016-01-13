'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selector = selector;

var _immutable = require('immutable');

var _ui = require('./ui');

var _createElement = require('virtual-dom/create-element');

var _createElement2 = _interopRequireDefault(_createElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /** @module utils */

_immutable.Collection.prototype.$ = function $(query, setVal) {
  var pathArray = selector(query);
  var tagName = pathArray.pop();
  var nodeVal = undefined,
      node = undefined;

  if (setVal !== undefined) {
    nodeVal = this.setIn(selector(query), setVal);
    node = new _immutable.Map().set(tagName, nodeVal);
    return node;
  } else {
    nodeVal = this.getIn(selector(query));
    node = new _immutable.Map().set(tagName, nodeVal);
    node.__queryNode = this;
    node.__query = query;
    return node;
  }
};

_immutable.Collection.prototype.children = function () {
  var tagName = this.findKey(function () {
    return true;
  });
  var node = this.set(tagName, this.get(tagName) || new _immutable.Map());

  var children = this.get(tagName) && this.get(tagName).filterNot(function (key) {
    key === 'props';
  }) || new _immutable.Map();
  var props = this.getIn([tagName, 'props']) || new _immutable.Map();
  if (arguments.length === 0) {
    return children;
  }
  if (arguments[0] && _typeof(arguments[0]) === 'object') {
    children = (0, _immutable.fromJS)(arguments[0]);
  } else if (typeof arguments[0] === 'string' && arguments[1] !== undefined) {
    children = arguments[1] === null ? children.delete(arguments[0]) : children.set(arguments[0], arguments[1]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return children.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query), children.set('props', props)) : this.set(tagName, children.set('props', props));
};

_immutable.Collection.prototype.toNode = function toNode(tagName) {
  return new _immutable.Map().set(tagName, this);
};

_immutable.Collection.prototype.toVNode = function toVNode(store) {
  return (0, _ui.renderUI)(store, this);
};

_immutable.Collection.prototype.toElement = function toElement(store) {
  var vNode = this.toVNode(store);
  if (vNode) {
    return (0, _createElement2.default)(vNode);
  }
};

_immutable.Collection.prototype.toHTML = function toHTML(store) {
  var element = this.toElement(store);
  if (element) {
    return element.outerHTML;
  }
};

_immutable.Collection.prototype.props = function () {
  var tagName = this.findKey(function () {
    return true;
  });
  var props = this.getIn([tagName, 'props']) || new _immutable.Map();
  if (arguments.length === 0) {
    return props;
  }
  if (_typeof(arguments[0]) === 'object') {
    props = props.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && arguments[1] !== undefined) {
    props = arguments[1] === null ? props.delete(arguments[0]) : props.set(arguments[0], (0, _immutable.fromJS)(arguments[1]));
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return props.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat('props'), props) : this.setIn([tagName, 'props'], props);
};

_immutable.Collection.prototype.style = function () {
  var tagName = this.findKey(function () {
    return true;
  });
  var style = this.getIn([tagName, 'props', 'style']) || new _immutable.Map();
  if (!style) {
    return new _immutable.Map();
  }
  if (arguments.length === 0) {
    return style;
  }

  if (_typeof(arguments[0]) === 'object') {
    style = style.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
    style = style.set(arguments[0], arguments[1]);
  } else if (typeof arguments[0] === 'string' && arguments[1] === null) {
    style = style.delete(arguments[0]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {

    return style.get(arguments[0]);
  }
  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat(['props', 'style']), style) : this.setIn([tagName, 'props', 'style'], style);
};

_immutable.Collection.prototype.events = function () {
  var tagName = this.findKey(function () {
    return true;
  });
  var events = this.getIn([tagName, 'props', 'events']) || new _immutable.Map();
  if (!events) {
    return new _immutable.Map();
  }
  if (arguments.length === 0) {
    return events;
  }

  if (_typeof(arguments[0]) === 'object') {
    events = events.merge(arguments[0]);
  } else if (typeof arguments[0] === 'string' && _typeof(arguments[1]) === 'object') {
    events = events.set(arguments[0], (0, _immutable.fromJS)(arguments[1]));
  } else if (typeof arguments[0] === 'string' && arguments[1] === null) {
    events = events.delete(arguments[0]);
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    return events.get(arguments[0]);
  }

  return this.__queryNode ? this.__queryNode.setIn(selector(this.__query).concat(['props', 'events']), events) : this.setIn([tagName, 'props', 'events'], events);
};

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
function selector(selectorString) {
  return selectorString.split(' ');
};