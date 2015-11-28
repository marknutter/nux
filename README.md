![NUX](http://i.imgur.com/vZHsn0E.png)

####A Push-Based Functional Reactive Web Application Framework

Nux combines [redux](http://redux.js.org), [virtual-dom](https://github.com/Matt-Esch/virtual-dom), and [immutable-js](http://redux.js.org) into a framework that enables the creation of applications whose entire state, UI included, lives in one large immutable object which can only be modified by creating a new state from provided reducer functions. Nux is not just another framework for binding application data to UI templates - it cuts out the middle man by treating UI and application data as one, single object, thus guaranteeing perfect agreement on state throughout an application's lifecycle. Nux can run on the client, on the server, or even in web workers to provide blazing fast rendering.

###Example

```js
import init from 'nux';

init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_STATEMENT':
      const output = state.getIn(['ui', 'div#hello-world', 'children', 'form', 'children', 'input', 'props', 'value']);
      const nextState = state.setIn(['ui', 'div#hello-world', 'children', 'form', 'children', 'input', 'props', 'value'], '');
      return nextState.setIn(['ui', 'div#hello-world', 'children', 'span#output', 'children', '$text'], output);
  }
  return state;
}, {
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

}, {logActions: true});
```

###todo

- [x] add logic to just persist todos as an alternative to saving entire ui tree
- [x] create mapping from event handlers to function callbacks so entire ui tree can be stringified and saved
- [x] rename and organize files in example to provide best practices
- [x] change src/ to example/ and update gruntFile.js accordingly
- [x] create nux reducer that auto-logs and provides baked-in framework specific actions
- [x] write tests for nux core
- [x] add options to init() that allow toggling of action logs and localStorage persistence
- [ ] write store helpers that provide boilerplate logic for actions such as selecting elements in the vdom object
- [ ] build out nux events that mirror common DOM events following pattern used for ev-input
- [ ] add jsdoc comments to nux core
- [ ] create a simple website for hosting on github.com. Dogfood nux to show these todos
- [ ] write tests for example app
- [ ] create todoMVC app in separate repo using Nux
- [ ] add fancy styling to action logger
