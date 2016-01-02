/** @module ui */

import h from 'virtual-dom/h';
import {fromJS, Map, List, Iterable} from 'immutable';


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
export function renderUI (store, ui, pathArray = List()) {

  // ui objects come as a key/value pair so extract the key as the tag name and value as the node data

  const tagName = ui.findKey(() => { return true });
  const node = ui.get(tagName);

  // keep track of our current location in the ui vDOM object
  const currentPathArray = pathArray.size === 0 ? pathArray.push(tagName) : pathArray;
  let children = List(),
      props = node.get('props') || Map();


  // recurse through this node's children and render their UI as hyperscript
  if (node.get('children')) {
    children = node.get('children').map((childVal, childTagName) => {
      if (childTagName === '$text') {
        return new List([childVal]);
      } else {
        return renderUI(store, (new Map()).set(childTagName, childVal), currentPathArray.concat(['children', childTagName]));
      }
    }).toList();
  }

  // add an event handler to inputs that updates their 'val' prop node when changes are detected
  let registeredKeyEvents = {};
  if (tagName.indexOf('input') > -1) {
    props = props.set('ev-keyup', (e) => {
      e.preventDefault();
        store.dispatch({
          type: '_UPDATE_INPUT_VALUE',
          val: e.target.value,
          pathArray: ['ui'].concat(currentPathArray.toJS())
        });
      registeredKeyEvents['ev-keyup'] ? registeredKeyEvents['ev-keyup'](e) : false;
      registeredKeyEvents[`ev-keyup-${e.keyCode}`] ? registeredKeyEvents[`ev-keyup-${e.keyCode}`](e) : false;
    });
  }

  // for any custom events detected, add callbacks that dispatch provided actions
  if (props.get('events')) {
    props = props.get('events').reduce((oldProps, val, key) => {
      if (key.indexOf('ev-keyup') > -1) {
        registeredKeyEvents[key] = (e) => {
          store.dispatch(val.get('dispatch').merge(Map({event:e})).toJS());
        };
        return oldProps;
      } else {
        return oldProps.set(key, (e) => {
          e.preventDefault();
          store.dispatch(val.get('dispatch').merge(Map({event:e})).toJS());
        });
      }
    }, props).delete('events');
  }

  // combine tag, props, and children into an array of plain javascript objects and return hyperscript VirtualNode
  return h.apply(this, [tagName, props.toJS(), children.toJS()]);
};


