import {init} from './lib/index';
import {selector} from './lib/utils';


init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
    return state.setIn(selector('div#hello-world form input props value'), '')
                .setIn(selector('div#hello-world span#output $text'),
                  state.getIn(selector('div#hello-world form input props value')));
  }
  return state;
},{
  'div#hello-world': {
    children: {
      'span#output': {
        props: {
          style: {
            fontWeight: 'bold'
          }
        }
      },
      'form': {
        props: {
          events: {
            'ev-submit': {
              dispatch: {
                type: 'SUBMIT_STATEMENT'
              }
            }
          }
        },
        children: {
          'input': {
            props: {
              placeholder: 'type and hit enter..'
            }
          }
        }
      }
    }
  }

}, {logActions: true}, document.querySelector('#hello-world-container'));
