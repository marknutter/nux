const defaultState = {
  'strong': {
    '$text': '0'
  },
  'span': {
    '$text': ' item left'
  }
}

export function todoCount(state = defaultState, action) {
  switch(action.type) {
    case 'SET_ACTIVE_TODO_COUNT':
      return state.setIn(['strong', '$text'], action.activeTodoCount)
                  .setIn(['span', '$text'], activeCount === 0 ? ' item left' : ' items left');
    default:
      return state;
  };
};