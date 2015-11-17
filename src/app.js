import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {renderUI} from './ui';
import getStore from './store';

let store = getStore();
let d = delegator();

let currentUI = h('div', 'loading...');
let rootNode = createElement(currentUI);

document.body.appendChild(rootNode);

store.subscribe(() => {

  var newUI = renderUI(store.getState().get('ui'));
  // debugger
  var patches = diff(currentUI, newUI);
  rootNode = patch(rootNode, patches);

  currentUI = newUI;
});


store.dispatch({
  type: 'LOAD_INITIAL_UI'
});
