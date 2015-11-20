
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {renderUI} from './ui';
import {initStore} from './store';

var nux = module.exports = {
  main: require('main-loop'),
  init: init
}

function init(reducer, initialUI = {}, opts = {}, elem = document.body) {


  let store = initStore(reducer);
  let d = delegator();
  let currentUI = h('div', 'loading...');
  let rootNode = createElement(currentUI);
  elem.appendChild(rootNode);

  store.subscribe(() => {
    const ui = store.getState().get('ui');
    localStorage.setItem('nux', JSON.stringify(ui.toJS()));
    var newUI = renderUI(ui);
    var patches = diff(currentUI, newUI);
    rootNode = patch(rootNode, patches);
    currentUI = newUI;
  });

  store.dispatch({
    type: 'LOAD_INITIAL_UI',
    ui: initialUI
  });
  return store;
}
