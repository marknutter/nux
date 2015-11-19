import {List, Map, fromJS, Seq} from 'immutable';
import {getStore} from './store';

export function todoFactory(title, tag) {
  return fromJS({
    props: {
      style: {
        display: 'block',
        padding: '20px'
      }
    },
    children: {
      'input': {
        props: {
          type: 'checkbox',
          'ev-click': (e) => {
            const checked = e.target.checked;
            getStore().dispatch({
              type: `${checked ? '' : 'UN'}COMPLETE_TODO`,
              tag: tag
            });
          }
        }
      },
      'span.title': {
        children: {
          '$text': title
        }
      }
    }
  });
}
