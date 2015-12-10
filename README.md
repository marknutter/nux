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

###Todo

- [x] add logic to just persist todos as an alternative to saving entire ui tree
- [x] create mapping from event handlers to function callbacks so entire ui tree can be stringified and saved
- [x] rename and organize files in example to provide best practices
- [x] change src/ to example/ and update gruntFile.js accordingly
- [x] create nux reducer that auto-logs and provides baked-in framework specific actions
- [x] write tests for nux core
- [x] add options to init() that allow toggling of action logs and localStorage persistence
- [x] write store helpers that provide boilerplate logic for actions such as selecting elements in the vdom object
- [x] add jsdoc comments to nux core
- [x] create todoMVC app using Nux
- [x] change ev-input to ev-keyup in nux default events and use to capture all manner of keystrokes
- [x] add router
- [x] change initialUI to initialAppState which includes 'router' and any other non ui data
- [x] create a simple website for hosting on github.com.
- [ ] require that routes be passed in on the initial state object instead of as an option
- [ ] add $ attribute to every immutable-js state object that acts as a jquery-like library to modify nux vDom objects
- [ ] get rid of need for "ev-" prefix on events
- [ ] get rid of nested 'dispatch' key on event objects
- [ ] allow path to lead off with 'children' in selector utility
- [ ] implement nux event that fires when a predicate is true. e.g. "do something when this element becomes visible"
- [ ] write tests for todoMVC app
- [ ] write tests for simple todo app
- [ ] figure out what to do about child elements - keep them as nested objects, or children in an array? what to do about sorting?
- [ ] allow additional options to be passed into event objects like stopPropagation:true/false
- [ ] convert these todos to github issues
- [ ] create contribution guide
- [ ] add fancy styling to action logger
