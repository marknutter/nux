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
            // TODO - split this into separate keyCode events
            'ev-keyup-13': {
              dispatch: {
                type: 'EDIT_TODO',
                tag: tag
              }
            },
            'ev-blur': {
              dispatch: {
                type: 'EDIT_TODO',
                tag: tag
              }
            },
            'ev-keyup-27': {
              dispatch: {
                type: 'CANCEL_EDIT_TODO',
                tag: tag
              }
            }
          }
        }
      }
    }
  });
}
