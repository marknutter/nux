import h from 'virtual-dom/h';
import getStore from './store';
import {fromJS, Map, List, Iterable} from 'immutable';

let store = getStore();


let ui = {
  'div#app': {
    props: {
      style: {
        fontFamily: 'helvetica'
      }
    },
    children: {
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
        children: {
          '$text': 'Oqodo'
        }
      },
      'div#posts': {
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
        children: {
          'form#new-post-form': {
            props: {
              style: {
                position: 'absolute',
                left: '10px',
                top: '10px'
              },
              'ev-submit': (e) => {
                e.preventDefault();
                const title = e.target.querySelector('input').value;
                e.target.querySelector('input').value = '';
                store.dispatch({
                  type: 'CREATE_POST',
                  title: title
                });
              },
            },
            children: {
              'input': {
                props: {
                  style: {
                    border: '1px solid #aaa',
                    fontSize: '16px',
                    padding: '5px'
                  },
                  placeholder: 'add new post'
                }
              }
            }
          },
          'div#posts-container': {
            props: {
              style: {
                position: 'absolute',
                top: '50px',
                left: '10px'
              }
            },
            children: {}
          }
        }
      }
    }
  }
};



// export function renderUI (ui, space = "") {
//   let node;
//   if (ui.map) {
//     node = ui.map((arg) => {
//       if (List.isList(arg)) {
//         return arg.map((n) => {
//           return renderUI(n, space + "  ");
//         });
//       } else {
//         return arg.toJS ? arg.toJS() : arg;
//       }
//     }).toJS()
//   } else {
//     node = [ui];
//   };
//   return h.apply(this, node);
// };

export function renderUI (ui, space = "") {
  let node = ui.map((val, key) => {

    let children = new List();
    if (val.get('children')) {
      children = val.get('children').map((val, key) => {
        if (key === '$text') {
          return new List([val]);
        } else {
          return renderUI((new Map()).set(key, val));
        }
      });
    }
    return [key, val.get('props').toJS(), children.toList().toJS()];
  });
  return h.apply(this, node.toList().toJS()[0]);
};

export function initialUI() {
  return fromJS(ui, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });
  // return fromJS(ui);
}
