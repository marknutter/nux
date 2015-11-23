
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {renderUI} from './ui';
import {initStore, getStore} from './store';
import {reducer} from './reducer';

var nux = module.exports = {
  init: init,
  store: getStore()
}

function init(appReducer, initialUI = {}, opts = {}, elem = document.body) {


  let store = initStore(reducer(appReducer));
  let d = delegator();
  let currentUI = h('div', 'loading...');
  let rootNode = createElement(currentUI);
  elem.appendChild(rootNode);

  store.subscribe(() => {
    const ui = store.getState().get('ui');
    localStorage.setItem('nux', JSON.stringify(ui ? ui.toJS() : {}));
    var newUI = renderUI(ui);
    var patches = diff(currentUI, newUI);
    rootNode = patch(rootNode, patches);
    currentUI = newUI;
  });

  if (localStorage.getItem('nux')) {
    initialUI = JSON.parse(localStorage.getItem('nux'));
  };

  store.dispatch({
    type: 'LOAD_INITIAL_UI',
    ui: initialUI
  });
  return store;
}
