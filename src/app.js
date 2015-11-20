import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {renderUI} from './ui';
import {initStore} from './store';
import reducer from './reducer';
import {List, Map, fromJS, Seq} from 'immutable';

let store = initStore(reducer);
let d = delegator();

let currentUI = h('div', 'loading...');

let rootNode = createElement(currentUI);

document.body.appendChild(rootNode);

store.subscribe(() => {
  const ui = store.getState().get('ui');
  localStorage.setItem('todos', JSON.stringify(ui.toJS()));
  var newUI = renderUI(ui);
  var patches = diff(currentUI, newUI);
  rootNode = patch(rootNode, patches);
  currentUI = newUI;
});


store.dispatch({
  type: 'LOAD_INITIAL_UI'
});

