


function addTodo(state, title) {
  if (title) {
    const todos = state.get('ui.todo-list') //state.getIn(selector(todoListPath + ' children'));

    const tag = `li#todo-${todos.size}`;
    const newTodo = todoComponent(title.trim(), tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#todo-")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return state.style('display', null);
  } else {
    state.$(todoInputPath).props('value', '');
  }
  return state;
}