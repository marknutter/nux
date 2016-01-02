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
 * @param {Store} store A redux store
 * @param {Object} ui The Nux vDOM object to be recursively converted into a VirtualNode
 * @param {Array} [pathArray] The location of the provided vDOM object within another vDOM object (if applicable)
 * @return {Store} Redux store where app state is maintained.
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

  // recurse through this node's children and render their UI as hyperscript
  if (node.get('children')) {
    children = node.get('children').map(function (childVal, childTagName) {
      if (childTagName === '$text') {
        return new _immutable.List([childVal]);
      } else {
        return renderUI(store, new _immutable.Map().set(childTagName, childVal), currentPathArray.concat(['children', childTagName]));
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
          store.dispatch(val.get('dispatch').merge((0, _immutable.Map)({ event: e })).toJS());
        };
        return oldProps;
      } else {
        return oldProps.set(key, function (e) {
          e.preventDefault();
          store.dispatch(val.get('dispatch').merge((0, _immutable.Map)({ event: e })).toJS());
        });
      }
    }, props).delete('events');
  }

  // combine tag, props, and children into an array of plain javascript objects and return hyperscript VirtualNode
  return _h2.default.apply(this, [tagName, props.toJS(), children.toJS()]);
};