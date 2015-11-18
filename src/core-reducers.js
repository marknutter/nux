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
  const tag = `div#${posts.size}`;
  const newPosts = posts.set(tag, newPost);
  const sortedPosts = newPosts.sortBy((val, key) => {
                        return parseInt(key.split("#")[1]);
                      }, (keyA, keyB) => {
                        return keyA < keyB ? 1 : -1;
                      });
  return state.setIn(postsPathArray, sortedPosts);
}

export function loadInitialUI(state) {
  const ui = fromJS(initialUI());
  return state.set('ui', ui);
}

