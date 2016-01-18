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
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, compose, applyMiddleware} from 'redux';
import utils from './utils';
import {renderUI} from './ui';
import {reducer} from './reducer';
import {fromJS, Map, Iterable} from 'immutable';
import Rlite from 'rlite-router';
import reduceReducers from 'reduce-reducers';

var nux = window.nux = module.exports = {
  init: init,
  options: {
    localStorage: false,
    logActions: false,
    actionCreators: {}
  },
  utils: utils
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
 * @param  {Function} appReducer The provided reducer function.
 * @param  {Object}   [options]                            Options to configure the nux application.
 * @param  {Object}   [options.initialUI={div: {}}]        The initial UI vDOM object which will become the first state to be rendered.
 * @param  {Boolean}  [options.localStorage=false]         Enable caching of global state to localStorage.
 * @param  {Boolean}  [options.logActions=false]           Enable advanced logging of all actions fired.
 * @param  {Element}  [options.targetElem=HTMLBodyElement] The element into which the nux application will be rendered.
 * @param  {Object}   [options.actionCreators={}]          Custom action creators with thunks enabled
 * @return {Store}    Redux store where app state is maintained.
 */
function init(appReducer, options = nux.options) {

  return (initialUI = {div: {}}) => {

    let initialState = initialUI;
    if (options.localStorage && localStorage.getItem('nux')) {
      initialState = JSON.parse(localStorage.getItem('nux'));
    };

    options.targetElem = options.targetElem || document.body;

    delegator();

    let router = Rlite();
    let middleWare = [thunkMiddleware];
    if (options.logActions) {
      middleWare.push(createLogger({
        stateTransformer: (state) => {
          return state.toJS();
        }
      }));
    }

    let finalAppReducer = typeof appReducer === 'function' ? appReducer : combineReducers(appReducer);

    let finalReducer = reduceReducers(reducer(initialState, options), finalAppReducer);

    const createStoreWithMiddleware = applyMiddleware.apply(this, middleWare)(createStore);
    let store = createStoreWithMiddleware(finalReducer);
    let currentUI = store.getState().get('ui').toVNode(store);
    let rootNode = createElement(currentUI);
    options.targetElem.appendChild(rootNode);

    store.getActionCreator = function(actionName) {
      if (options.actionCreators[actionName] === undefined) {
        throw new Error(`AtionCreatorNotFoundError: no action creator has been specified for the key ${actionName}`);
      }
      return options.actionCreators[actionName];
    }

    if (store.getState().get('routes')) {
      store.getState().get('routes').forEach((action, route) => {
        router.add(route, (r) => {
          store.dispatch(action.merge(Map(r)).toJS());
        });
      });

      function processHash() {
        var hash = location.hash || '#';
        router.run(hash.slice(1));
      }

      window.addEventListener('hashchange', processHash);
      processHash();
    }

    store.subscribe(() => {
      const ui = store.getState().get('ui');
      if (options.localStorage) {
        localStorage.setItem('nux', JSON.stringify(ui ? ui.toJS() : {}));
      }
      var newUI = store.getState().get('ui').toVNode(store);
      var patches = diff(currentUI, newUI);
      rootNode = patch(rootNode, patches);
      currentUI = newUI;
    });

    return store;

  }
}



