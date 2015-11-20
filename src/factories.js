import {List, Map, fromJS, Seq} from 'immutable';
import {getStore} from './store';

export function todoFactory(title, tag) {
  return fromJS({
    props: {
      style: {
        display: 'block',
        padding: '5px'
      }
    },
    children: {
      'input': {
        props: {
          style: {
            top: '-1px',
            position: 'relative'
          },
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
        props: {
          style: {
            marginLeft: '10px'
          },
        },
        children: {
          '$text': title
        }
      }
    }
  });
}
