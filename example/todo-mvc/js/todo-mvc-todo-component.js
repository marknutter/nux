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
            children: {
              '$text': title
            }
          },
          'button.destroy': {

          }
        }
      },
      'input.edit': {
        props: {
          val: title
        }
      }
    }
  });
}
