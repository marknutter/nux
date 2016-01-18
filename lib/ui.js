'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderUI = renderUI;

var _h = require('virtual-dom/h');

var _h2 = _interopRequireDefault(_h);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Accepts a Nux vDOM object and returns a VirtualNode. The vDOM object's 'children' are recursively converted
 * to VirtualNodes. The 'props' for any given are modified such that any custom events are assigned callbacks
 * which dispatch the associated actions. The Nux default event handlers are also added to the 'props' object
 * for a given node. This is where all the magic happens, folks.
 *
 * @author Mark Nutter <marknutter@gmail.com>
 *
 * @param {Store} store       A redux store
 * @param {Object} ui         The Nux vDOM object to be recursively converted into a VirtualNode
 * @param {Array} [pathArray] The location of the provided vDOM object within another vDOM object (if applicable)
 * @return {Store}            Redux store where app state is maintained
 */
/** @module ui */

function renderUI(store, ui) {
  var pathArray = arguments.length <= 2 || arguments[2] === undefined ? (0, _immutable.List)() : arguments[2];

  // ui objects come as a key/value pair so extract the key as the tag name and value as the node data

  var tagName = ui.findKey(function () {
    return true;
  });
  var node = ui.get(tagName);

  // keep track of our current location in the ui vDOM object
  var currentPathArray = pathArray.size === 0 ? pathArray.push(tagName) : pathArray;
  var children = (0, _immutable.List)(),
      props = node.get('props') || (0, _immutable.Map)();

  var childNodes = node.filterNot(function (val, key) {
    return key === 'props';
  });

  // recurse through this node's children and render their UI as hyperscript
  if (childNodes) {
    children = childNodes.map(function (childVal, childTagName) {
      if (childTagName === '$text') {
        return new _immutable.List([childVal]);
      } else {
        return renderUI(store, new _immutable.Map().set(childTagName, childVal), currentPathArray.concat([childTagName]));
      }
    }).toList();
  }

  // add an event handler to inputs that updates their 'val' prop node when changes are detected
  var registeredKeyEvents = {};
  if (tagName.indexOf('input') > -1) {
    props = props.set('ev-keyup', function (e) {
      e.preventDefault();
      store.dispatch({
        type: '_UPDATE_INPUT_VALUE',
        val: e.target.value,
        pathArray: ['ui'].concat(currentPathArray.toJS())
      });
      registeredKeyEvents['ev-keyup'] ? registeredKeyEvents['ev-keyup'](e) : false;
      registeredKeyEvents['ev-keyup-' + e.keyCode] ? registeredKeyEvents['ev-keyup-' + e.keyCode](e) : false;
    });
  }

  // for any custom events detected, add callbacks that dispatch provided actions
  if (props.get('events')) {
    props = props.get('events').reduce(function (oldProps, val, key) {
      if (key.indexOf('ev-keyup') > -1) {
        registeredKeyEvents[key] = function (e) {
          fireDispatch(store, val, e);
          createAction(store, val, e);
        };
        return oldProps;
      } else {
        return oldProps.set(key, function (e) {
          e.preventDefault();
          fireDispatch(store, val, e);
          createAction(store, val, e);
        });
      }
    }, props).delete('events');
  }

  // combine tag, props, and children into an array of plain javascript objects and return hyperscript VirtualNode
  return _h2.default.apply(this, [tagName, props.toJS(), children.toJS()]);
};

function fireDispatch(store, val, event) {
  if (val.get('dispatch')) {
    store.dispatch(val.get('dispatch').merge((0, _immutable.Map)({ event: event })).toJS());
  }
}

function createAction(store, val, event) {
  if (val.get('action')) {
    // if the action is an object, pass that object along as the argument to the action creator
    if (typeof val.getIn(['action', 'type']) === 'string') {
      var actionCreator = store.getActionCreator(val.getIn(['action', 'type']));
      var action = val.get('action').merge((0, _immutable.Map)({ event: event })).toJS();
      store.dispatch(actionCreator(action));
    }
    // if the action is just the action name, then fire it without any arguments
    else if (typeof val.get('action') === 'string') {
        var actionCreator = store.getActionCreator(val.get('action'));
        var action = (0, _immutable.Map)({ type: val.get('action'), event: event }).toJS();
        store.dispatch(actionCreator(action));
      }
  }
}