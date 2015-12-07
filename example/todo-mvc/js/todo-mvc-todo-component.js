import {fromJS} from 'immutable';

export function todoComponent(title, tag) {
  return fromJS({
    children: {
      'div.view': {
        props: {

        },
        children: {
          'input.toggle': {
            props: {
              type: 'checkbox',
              events: {
                'ev-change': {
                  dispatch: {
                    type: 'TOGGLE_TODO',
                    tag: tag
                  }
                }
              }
            }
          },
          'label': {
            props: {
              events: {
                'ev-dblclick': {
                  dispatch: {
                    type: 'SHOW_EDIT_TODO',
                    tag: tag
                  }
                }
              }
            },
            children: {
              '$text': title
            }
          },
          'button.destroy': {
            props: {
              events: {
                'ev-click': {
                  dispatch: {
                    type: 'DELETE_TODO',
                    tag: tag
                  }
                }
              }
            }
          }
        }
      },
      'input.edit': {
        props: {
          val: title,
          events: {
            'ev-keyup': {
              dispatch: {
                type: 'EDIT_TODO',
                tag: tag
              }
            }
          }
        }
      }
    }
  });
}
