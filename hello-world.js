import {init} from './src/index';

let helloWorld = init(

// first argument is your reducer - the only concern that modifies your app's state
(state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
    const inputVal = state.$('ui div#hw input').props('value');
    return state.$('ui div#hw h5 $text', inputVal)
                .$('ui div#hw input').props('value', '');
  }
  return state;
},


// second argument are any custom action creators you want to specify
{},


// third argument is your options where you can enable action and state logging
{logActions: true},


// fourth argument is the dom element you want your Nux app to render inside of
document.querySelector('#hello-world-container')

);


// call the app function with your initial UI object and let Nux handle it from there
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
