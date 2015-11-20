import {createStore, compose} from 'redux';

let store;

export function getStore() {
  return store;
}

export function initStore(reducer) {
  store = createStore(reducer);
  return store;
}
