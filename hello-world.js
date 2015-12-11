import {init} from './lib/index';
import {selector} from './lib/utils';


init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
    const inputVal = selector('div#hw input props value');
    return state.setIn(selector('div#hw h5 $text'), state.getIn(inputVal))
                .setIn(inputVal, '');
  }
  return state;
},{
  'div#hw': {
    children: {
      'h5': {
      },
      'input': {
        props: {
          placeholder: 'type and hit enter..',
            events: {
            'ev-keyup-13': {
              dispatch: {
                type: 'SUBMIT_STATEMENT'
              }
            }
          }
        }
      }
    }
  }
}, {logActions: true}, document.querySelector('#hello-world-container'));
