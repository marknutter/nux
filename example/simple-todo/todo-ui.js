export const todoUi = {
  ui: {
    'div#app': {
      props: {
        style: {
          fontFamily: 'helvetica'
        }
      },
      'div#header': {
        props: {
          style: {
            fontSize: '18px',
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '0px',
            height: '40px',
            lineHeight: '40px',
            textIndent: '20px',
            borderBottom: '1px solid #ddd'
          }
        },
        '$text': 'Nux Todos'
      },
      'div#todos': {
        props: {
          style: {
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '40px',
            bottom: '0px',
            backgroundColor: "rgba(0,0,0,0.05)"
          }
        },
        'form#new-todo-form': {
          props: {
            style: {
              position: 'absolute',
              left: '10px',
              top: '10px'
            },
            events: {
              'ev-submit': {
                dispatch: {
                  type: 'SUBMIT_TODO'
                }
              }
            }
          },
          'input': {
            props: {
              style: {
                border: '1px solid #aaa',
                fontSize: '16px',
                padding: '5px'
              },
              placeholder: 'add new todo'
            }
          }
        },
        'div#todo-container': {
          props: {
            style: {
              position: 'absolute',
              top: '50px',
              left: '10px'
            }
          }
        }
      }
    }
  }
};


