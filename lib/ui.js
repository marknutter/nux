import h from 'virtual-dom/h';
import {getStore} from './store';
import {fromJS, Map, List, Iterable} from 'immutable';



export function renderUI (ui, pathArray = List()) {
  let node = ui.map((val, key) => {
    let nodeArray = [key];
    const currentPathArray = pathArray.size === 0 ? pathArray.push(key) : pathArray;
    let children = new List();
    if (val.get('children')) {
      children = val.get('children').map((val, key) => {
        if (key === '$text') {
          return new List([val]);
        } else {
          return renderUI((new Map()).set(key, val), currentPathArray.concat(['children', key]));
        }
      });
    }
    const props = getPropsWithDefaultEvents(val.get('props'), key, currentPathArray);
    if (props.get('events')) {
      const propsWithCustomEvents = props.get('events').reduce((oldProps, val, key) => {
        const newProps = oldProps.set(key, (e) => {
          e.preventDefault();
          getStore().dispatch(val.get('dispatch').toJS());
        });
        return newProps
      }, props);
      nodeArray.push(propsWithCustomEvents.toJS());
    } else {
      nodeArray.push(props.toJS());
    }
    nodeArray.push(children.toList().toJS());
    return nodeArray;
  });
  return h.apply(this, node.toList().toJS()[0]);
};

export function initUI(ui) {

  if (localStorage.getItem('nux')) {
    ui = JSON.parse(localStorage.getItem('nux'));
  };

  return fromJS(ui, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });
}



function getPropsWithDefaultEvents(props = Map(), tag, currentPathArray) {
  if (tag.indexOf('input') > -1) {
    return props.set('ev-input', (e) => {
      e.preventDefault();
      if (e.target.value) {
        getStore().dispatch({
          type: 'UPDATE_INPUT_VALUE',
          val: e.target.value,
          pathArray: ['ui'].concat(currentPathArray.toJS())
        })
      }
    })
  } else {
    return props;
  }
}
