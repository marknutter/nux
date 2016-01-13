export const todoMvcUi = {
  'div#todoapp': {
    'section.todoapp': {
      'header.header': {
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
      },
      'section.main': {
        props: {
          style: {
            display: 'none'
          }
        },
        'input.toggle-all': {
          props: {
            type: 'checkbox',
            events: {
              'ev-change': {
                dispatch: {
                  type: 'TOGGLE_ALL_TODOS'
                }
              }
            }
          }
        },
        'label': {
          props: {
            htmlFor: 'toggle-all'
          },
          '$text': 'Mark all as complete'
        },
        'ui.todo-list': {

        }
      },
      'footer.footer': {
        props: {
          style: {
            display: 'none'
          }
        },
        'span.todo-count': {
          'strong': {
            '$text': '0'
          },
          'span': {
            '$text': ' item left'
          }
        },
        'ul.filters': {
          'li.all': {
            'a': {
              props: {
                href: '#/',
                events: {
                  'ev-click': {
                    dispatch: {
                      type: 'SHOW_TODOS',
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
                      type: 'SHOW_TODOS',
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
                      type: 'SHOW_TODOS',
                      view: 'completed'
                    }
                  }
                }
              },
              '$text': 'Completed'
            }
          }
        },
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
    },
    'footer.info': {
      props: {
        style: {
          display: 'none'
        }
      },
      'p': {
        '$text': 'Double-click to edit a todo'
      }
    }
  }
};


