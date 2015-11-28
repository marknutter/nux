
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {createStore, compose} from 'redux';
import {renderUI} from './ui';
import {reducer} from './reducer';

var nux = module.exports = {
  init: init,
  opts: {
    localStorage: false,
    actionLogs: false
  }
};

function init(appReducer, initialUI = {}, opts = nux.opts, elem = document.body) {
  let initialState = initialUI;
  if (opts.localStorage && localStorage.getItem('nux')) {
    initialState = JSON.parse(localStorage.getItem('nux'));
  };

  delegator();

  let store = createStore(reducer(appReducer, initialState, opts));
  let currentUI = renderUI(store, store.getState().get('ui'));
  let rootNode = createElement(currentUI);
  elem.appendChild(rootNode);

  store.subscribe(() => {
    const ui = store.getState().get('ui');
    if (opts.localStorage) {
      localStorage.setItem('nux', JSON.stringify(ui ? ui.toJS() : {}));
    }
    var newUI = renderUI(store, ui);
    var patches = diff(currentUI, newUI);
    rootNode = patch(rootNode, patches);
    currentUI = newUI;
  });

  return store;
}





