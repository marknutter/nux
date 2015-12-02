[![NUX](http://marknutter.github.io/nux/assets/images/nux-logo.png)](http://marknutter.github.io/nux)

####A Push-Based Functional Reactive Web Application Framework

Nux combines [redux](http://redux.js.org), [virtual-dom](https://github.com/Matt-Esch/virtual-dom), and [immutable-js](http://redux.js.org) into a framework that enables the creation of applications whose entire state, UI included, lives in one large immutable object which can only be modified by creating a new state from provided reducer functions. Nux is not just another framework for binding application data to UI templates - it cuts out the middle man by treating UI and application data as one, single object, thus guaranteeing perfect agreement on state throughout an application's lifecycle. Nux can run on the client, on the server, or even in web workers to provide blazing fast rendering.

####[Try the example todo app](http://marknutter.github.io/nux/example/index.html)

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
    return state.setIn(selector('div#hello-world form input props value'), '')
                .setIn(selector('div#hello-world span#output $text'),
                  state.getIn(selector('div#hello-world form input props value')));
  }
  return state;
},


// second argument is your initial app UI state represented as a Nux vDom object
{
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
              placeholder: 'say something..'
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


);

// That's all she wrote!
```

###todo

- [x] add logic to just persist todos as an alternative to saving entire ui tree
- [x] create mapping from event handlers to function callbacks so entire ui tree can be stringified and saved
- [x] rename and organize files in example to provide best practices
- [x] change src/ to example/ and update gruntFile.js accordingly
- [x] create nux reducer that auto-logs and provides baked-in framework specific actions
- [x] write tests for nux core
- [x] add options to init() that allow toggling of action logs and localStorage persistence
- [x] write store helpers that provide boilerplate logic for actions such as selecting elements in the vdom object
- [x] add jsdoc comments to nux core
- [ ] create todoMVC app in separate repo using Nux
- [ ] build out nux events that mirror common DOM events following pattern used for ev-input
- [ ] create a simple website for hosting on github.com. Dogfood nux to show these todos
- [ ] write tests for example app
- [ ] add fancy styling to action logger
