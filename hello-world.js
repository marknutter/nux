import {init} from './src/index';

// initialize your app with a reducer, the only concern that modifies your app's state

let helloWorld = init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
    const inputVal = state.$('ui div#hw input').props('value');
    return state.$('ui div#hw h5 $text', inputVal)
                .$('ui div#hw input').props('value', '');
  }
  return state;
}, { // provide a target element in which to render your nux application
  targetElem: document.querySelector('#hello-world-container')
});


// pass an initial UI object to the app to start it up

helloWorld({
  'div#hw': {
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
});
