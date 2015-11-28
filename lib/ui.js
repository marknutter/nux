/** @module ui */

import h from 'virtual-dom/h';
import {fromJS, Map, List, Iterable} from 'immutable';

module.exports = {
  renderUI
};

function renderUI (store, ui, pathArray = List()) {
  let node = ui.map((val, key) => {
    let nodeArray = [key];
    const currentPathArray = pathArray.size === 0 ? pathArray.push(key) : pathArray;
    let children = new List();
    if (val.get('children')) {
      children = val.get('children').map((val, key) => {
        if (key === '$text') {
          return new List([val]);
        } else {
          return renderUI(store, (new Map()).set(key, val), currentPathArray.concat(['children', key]));
        }
      });
    }
    const props = getPropsWithDefaultEvents(store, val.get('props'), key, currentPathArray);
    if (props.get('events')) {
      const propsWithCustomEvents = props.get('events').reduce((oldProps, val, key) => {
        const newProps = oldProps.set(key, (e) => {
          e.preventDefault();
          store.dispatch(val.get('dispatch').toJS());
        });
        return newProps;
      }, props).delete('events');
      nodeArray.push(propsWithCustomEvents.toJS());
    } else {
      nodeArray.push(props.toJS());
    }
    nodeArray.push(children.toList().toJS());
    return nodeArray;
  });
  return h.apply(this, node.toList().toJS()[0]);
};

function getPropsWithDefaultEvents(store, props = Map(), tag, currentPathArray) {
  if (tag.indexOf('input') > -1) {
    return props.set('ev-input', evInput(store, currentPathArray));
  } else {
    return props;
  }
};

function evInput(store, currentPathArray) {
  return (e) => {
    e.preventDefault();
    if (e.target.value) {
      store.dispatch({
        type: '_UPDATE_INPUT_VALUE',
        val: e.target.value,
        pathArray: ['ui'].concat(currentPathArray.toJS())
      });
    }
  };
};
