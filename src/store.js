import {createStore, compose} from 'redux';
import reducer from './reducer';

let store = createStore(reducer);

export default function() {
  return store;
}
