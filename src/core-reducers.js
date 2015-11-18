import h from 'virtual-dom/h';
import {initialUI} from './ui';
import {List, Map, fromJS, Seq} from 'immutable';
import ui from './ui';

export function createPost(state, title) {
  let newPost = fromJS({
    props: {
      style: {
        display: 'block',
        padding: '20px'
      }
    },
    children: {
      '$text': title
    }
  });
  const postsPathArray = ['ui', 'div#app', 'children', 'div#posts', 'children', 'div#posts-container', 'children'];
  const posts = state.getIn(postsPathArray);
  return state.setIn(postsPathArray.concat([`div#${posts.size}`]), newPost);
}

export function loadInitialUI(state) {
  console.log('fromJS', fromJS)
  const ui = fromJS(initialUI());
  return state.set('ui', ui);
}

