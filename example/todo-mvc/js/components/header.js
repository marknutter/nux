const defaultState = {
  'h1': {
    '$text': 'todos'
  },
  'input.new-todo': {
    props: {
      placeholder: 'What needs to be done?',
      autofocus: true,
      events: {
        'ev-keyup-13': {
          dispatch: {
            type: 'ADD_TODO'
          }
        }
      }
    }
  }
}

export function header(state = defaultState, action) {
  switch(action.type) {
    case 'ADD_TODO':
      if (state.getIn(['input.new-todo','value'])) {
        return state.setIn(['input.new-todo', 'value'], '');
      }
      return state;
    default:
      return state;
  }
}

