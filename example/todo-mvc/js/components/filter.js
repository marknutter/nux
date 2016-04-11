const defaultState = {
  'li.all': {
    'a': {
      props: {
        href: '#/',
        events: {
          'ev-click': {
            dispatch: {
              type: 'FILTER_TODOS',
              view: 'all'
            }
          }
        },
        className: 'selected'
      },
      '$text': 'All'
    }
  },
  'li.active': {
    'a': {
      props: {
        href: '#/active',
        events: {
          'ev-click': {
            dispatch: {
              type: 'FILTER_TODOS',
              view: 'active'
            }
          }
        }
      },
      '$text': 'Active'
    }
  },
  'li.completed': {
    'a': {
      props: {
        href: '#/completed',
        events: {
          'ev-click': {
            dispatch: {
              type: 'FILTER_TODOS',
              view: 'completed'
            }
          }
        }
      },
      '$text': 'Completed'
    }
  }
}


export function selectFilter(state = defaultState, action) {
  switch(action.type) {
    case 'FILTER_TODOS':
      window.location && window.location = `#/${filter}`;
      return state.map((val, key) => {
        const filter = val.toNode(key);
        return filter.$(`${key} a`).props('className', key.indexOf(action.filter) !== -1 ? 'selected' : '').get(key);
      });
    default:
      return state;
  };
};