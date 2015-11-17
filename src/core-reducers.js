import h from 'virtual-dom/h';
import {initialUI} from './ui';
import {List, Map, fromJS, Seq} from 'immutable';
import ui from './ui';

export function createPost(state, title) {
  let newPost = List(['div',
    {
      style: {
        display: 'block',
        padding: '20px'
      }
    },
    title
  ]);
  const newPosts = state.getIn(['ui','2','1','2','1','2']).push(newPost);
  return state.setIn(['ui','2','1','2','1','2'], newPosts);
}

export function loadInitialUI(state) {
  console.log('fromJS', fromJS)
  const ui = fromJS(initialUI());
  return state.set('ui', ui);
}

