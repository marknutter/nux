
const defaultState = {
  props: {
    style: {
      display: 'none'
    }
  },
  'span.todo-count': todoCount,
  'ul.filters': filter,
  'button.clear-completed': {
    props: {
      events: {
        'ev-click': {
          dispatch: {
            type: 'CLEAR_COMPLETED_TODOS'
          }
        }
      }
    },
    '$text': 'Clear completed'
  }
}

export function footer(state = defaultState, action) {
  return state.set('span.todo-count', todoCount(state.get('span.todo-count')));
  
}
