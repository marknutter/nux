'use strict';

var _h = require('virtual-dom/h');

var _h2 = _interopRequireDefault(_h);

var _diff = require('virtual-dom/diff');

var _diff2 = _interopRequireDefault(_diff);

var _patch = require('virtual-dom/patch');

var _patch2 = _interopRequireDefault(_patch);

var _createElement = require('virtual-dom/create-element');

var _createElement2 = _interopRequireDefault(_createElement);

var _domDelegator = require('dom-delegator');

var _domDelegator2 = _interopRequireDefault(_domDelegator);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _redux = require('redux');

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _ui = require('./ui');

var _reducer = require('./reducer');

var _immutable = require('immutable');

var _rliteRouter = require('rlite-router');

var _rliteRouter2 = _interopRequireDefault(_rliteRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nux = window.nux = module.exports = {
  init: init,
  options: {
    localStorage: false,
    logActions: false
  },
  utils: _utils2.default
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

function init(appReducer) {
  var initialUI = arguments.length <= 1 || arguments[1] === undefined ? (0, _immutable.fromJS)({ div: {} }) : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? nux.options : arguments[2];
  var elem = arguments.length <= 3 || arguments[3] === undefined ? document.body : arguments[3];

  var initialState = initialUI;
  if (options.localStorage && localStorage.getItem('nux')) {
    initialState = JSON.parse(localStorage.getItem('nux'));
  };

  (0, _domDelegator2.default)();

  var router = (0, _rliteRouter2.default)();
  var middleWare = [_reduxThunk2.default];
  if (options.logActions) {
    middleWare.push((0, _reduxLogger2.default)({
      stateTransformer: function stateTransformer(state) {
        return state.toJS();
      }
    }));
  }
  var createStoreWithMiddleware = _redux.applyMiddleware.apply(this, middleWare)(_redux.createStore);
  var store = createStoreWithMiddleware((0, _reducer.reducer)(appReducer, initialState, options));
  var currentUI = store.getState().get('ui').toVNode(store);
  var rootNode = (0, _createElement2.default)(currentUI);

  elem.appendChild(rootNode);

  if (store.getState().get('routes')) {
    var processHash = function processHash() {
      var hash = location.hash || '#';
      router.run(hash.slice(1));
    };

    store.getState().get('routes').forEach(function (action, route) {
      router.add(route, function (r) {
        store.dispatch(action.merge((0, _immutable.Map)(r)).toJS());
      });
    });

    window.addEventListener('hashchange', processHash);
    processHash();
  }

  store.subscribe(function () {
    var ui = store.getState().get('ui');
    if (options.localStorage) {
      localStorage.setItem('nux', JSON.stringify(ui ? ui.toJS() : {}));
    }
    var newUI = store.getState().get('ui').toVNode(store);
    var patches = (0, _diff2.default)(currentUI, newUI);
    rootNode = (0, _patch2.default)(rootNode, patches);
    currentUI = newUI;
  });

  return store;
}