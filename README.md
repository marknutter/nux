
     __  _ __ ____  __
    |  \| |  |  \ \/ /
    |_|\__|\___//_/\_\


A Pure Functional Reactive Web UI Library

"What a framework! What a lovely framework!!"


###todo

- [x] add logic to just persist todos as an alternative to saving entire ui tree
- [x] create mapping from event handlers to function callbacks so entire ui tree can be stringified and saved
- [x] rename and organize files in example to provide best practices
- [x] change src/ to example/ and update gruntFile.js accordingly
- [x] create nux reducer that auto-logs and provides baked-in framework specific actions
- [x] write tests for nux core
- [ ] add options to init() that allow toggling of action logs and localStorage persistence
- [ ] write store helpers that provide boilerplate logic for actions such as selecting elements in the vdom object
- [ ] create nux events that mirror DOM events and add new events such as changes to a particular node in the vdom
- [ ] add jsdoc comments to nux core
- [ ] create a simple website for hosting on github.com. Dogfood nux to show these todos
- [ ] write tests for example app
- [ ] convert todo example app, or create an additional example app to be a todoMVC app following their guidelines
- [ ] add fancy styling to action logger
