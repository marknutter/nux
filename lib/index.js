/** @module index */



/* Type Definititions */

/**
 * A Redux store.
 * @typedef {Object} Store
 * @property {Function} dispatch Dispatch a provided action with type to invoke a matching reducer.
 * @property {Function} getState Get the current global state.
 * @property {Function} subscribe Provide callback to be invoked every time an action is fired.
 * @property {Function} replaceReducer Replace an existing reducer with a new one.
 */

import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import delegator from 'dom-delegator';
import {createStore, compose} from 'redux';
import {renderUI} from './ui';
import {reducer} from './reducer';



var nux = window.nux = module.exports = {
  init: init,
  options: {
    localStorage: false,
    logActions: false
  }
};


/**
 * Used to initialize a new Nux application. Any reducer that is provided will be combined with Nux's built
 * in reducers. The initial UI is the base template for the application and is what will be rendered immediately
 * upon initialization. A number of options can be provided as documented, and any element can be specified into
 * which Nux will render the application, allowing for the running of multiple, disparate instances of Nux on
 * a given page. A Redux store is returned, although direct interaction with the store should be unnecessary.
 * Once initialized, any changes to the global state for a given Nux instance will be immediately reflected in
 * via an efficient patching mechanism via virtual-dom.
 *
 * @author Mark Nutter <marknutter@gmail.com>
 * @summary Initialize a Nux application.
 *
 * @param {Function} appReducer The provided reducer function.
 * @param {Object} [initialUI] The initial UI vDOM object which will become the first state to be rendered.
 * @param {Object} [options] Options to configure the nux application.
 * @param {Boolean} [options.localStorage=false] Enable caching of global state to localStorage.
 * @param {Boolean} [options.logActions=false] Enable advanced logging of all actions fired.
 * @param {Element} [elem=HTMLBodyElement] The element into which the nux application will be rendered.
 * @return {Store} Redux store where app state is maintained.
 */
function init(appReducer, initialUI = {}, options = nux.options, elem = document.body) {
  let initialState = initialUI;
  if (options.localStorage && localStorage.getItem('nux')) {
    initialState = JSON.parse(localStorage.getItem('nux'));
  };

  delegator();

  let store = createStore(reducer(appReducer, initialState, options));
  let currentUI = renderUI(store, store.getState().get('ui'));
  let rootNode = createElement(currentUI);
  elem.appendChild(rootNode);

  store.subscribe(() => {
    const ui = store.getState().get('ui');
    if (options.localStorage) {
      localStorage.setItem('nux', JSON.stringify(ui ? ui.toJS() : {}));
    }
    var newUI = renderUI(store, ui);
    var patches = diff(currentUI, newUI);
    rootNode = patch(rootNode, patches);
    currentUI = newUI;
  });

  return store;
}



