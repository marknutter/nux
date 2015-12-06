export const todoMvcUi = {
  'div#todoapp': {
    children: {
      'section.todoapp': {
        children: {
          'header.header': {
            children: {
              'h1': {
                children: {
                  '$text': 'todos'
                }
              },
              'input.new-todo': {
                props: {
                  placeholder: 'What needs to be done?',
                  autofocus: true,
                  events: {
                    'ev-keyup': {
                      dispatch: {
                        type: 'ADD_TODO'
                      }
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
            children: {
              'input.toggle-all': {
                props: {
                  type: 'checkbox'
                }
              },
              'label': {
                props: {
                  for: 'toggle-all'
                },
                children: {
                  '$text': 'Mark all as complete'
                }
              },
              'ui.todo-list': {
                children: {

                }
              }
            }
          },
          'footer.footer': {
            children: {
              'span.todo-count': {
                children: {
                  'strong': {
                    children: {
                      '$text': '0'
                    }
                  },
                  '$text': 'item left'
                }
              },
              'ul.filters': {
                children: {
                  'li': {
                    children: {
                      'a.selected': {
                        props: {
                          href: '#/'
                        },
                        children: {
                          '$text': 'All'
                        }
                      }
                    }
                  },
                  'li': {
                    children: {
                      'a.selected': {
                        props: {
                          href: '#/active'
                        },
                        children: {
                          '$text': 'Active'
                        }
                      }
                    }
                  },
                  'li': {
                    children: {
                      'a.selected': {
                        props: {
                          href: '#/completed'
                        },
                        children: {
                          '$text': 'Completed'
                        }
                      }
                    }
                  }
                }
              },
              'button.clear-completed': {
                children: {
                  '$text': 'Clear completed'
                }
              }
            }
          }
        }
      },
      'footer.info': {
        props: {
          style: {
            display: 'none'
          }
        },
        children: {
          'p': {
            children: {
              '$text': 'Double-click to edit a todo'
            }
          }
        }
      }
    }
  }
};


