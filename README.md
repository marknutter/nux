[![NUX](http://marknutter.github.io/nux/assets/images/nux-logo.png)](http://marknutter.github.io/nux)

####A Push-Based Functional Reactive Web Application Framework

Nux combines [redux](http://redux.js.org), [virtual-dom](https://github.com/Matt-Esch/virtual-dom), and [immutable-js](http://redux.js.org) into a framework that enables the creation of applications whose entire state, UI included, lives in one large immutable object which can only be modified by creating a new state from provided reducer functions. Nux is not just another framework for binding application data to UI templates - it cuts out the middle man by treating UI and application data as one, single object, thus guaranteeing perfect agreement on state throughout an application's lifecycle. Nux can run on the client, on the server, or even in web workers to provide blazing fast rendering.

####[Try the simple example todo app](http://marknutter.github.io/nux/example/simple-todo/index.html)

####[Try the example TodoMVC app](http://marknutter.github.io/nux/example/todo-mvc/index.html)

####[Read the documentation](http://marknutter.github.io/nux/docs/module-index.html)

###Example

```js
import init from 'nux';
import {selector} from 'nux/utils';


init(


// first argument is your reducer - the only concern that modifies your app's state
(state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
    const inputVal = selector('div#hw input props value');
    return state.setIn(selector('div#hw h5 $text'), state.getIn(inputVal))
                .setIn(inputVal, '');
  }
  return state;
},


// second argument is your initial app UI state represented as a Nux vDom object
{
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
},


// third argument is your options where you can enable action and state logging
{logActions: true},


// fourth argument is the dom element you want your Nux app to render inside of
document.querySelector('#hello-world-container')

); // That's all she wrote!
```
