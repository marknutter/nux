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
                    'ev-keyup-13': {
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
            props: {
              style: {
                display: 'none'
              }
            },
            children: {
              'span.todo-count': {
                children: {
                  'strong': {
                    children: {
                      '$text': '0'
                    }
                  },
                  'span': {
                    children: {
                      '$text': ' item left'
                    }
                  }
                }
              },
              'ul.filters': {
                children: {
                  'li.all': {
                    children: {
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
                        children: {
                          '$text': 'All'
                        }
                      }
                    }
                  },
                  'li.active': {
                    children: {
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
                        children: {
                          '$text': 'Active'
                        }
                      }
                    }
                  },
                  'li.completed': {
                    children: {
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
                        children: {
                          '$text': 'Completed'
                        }
                      }
                    }
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


