import h from 'virtual-dom/h';
import {getStore} from './store';
import {fromJS, Map, List, Iterable} from 'immutable';



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
          '$text': 'Nux Todos'
        }
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
        children: {
          'form#new-todo-form': {
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
                getStore().dispatch({
                  type: 'CREATE_TODO',
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
                  placeholder: 'add new todo'
                }
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
            },
            children: {}
          }
        }
      }
    }
  }
};


export function renderUI (ui, space = "") {
  let node = ui.map((val, key) => {
    let nodeArray = [key];
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
    if (val.get('props')) {
      nodeArray.push(val.get('props').toJS());
    }
    nodeArray.push(children.toList().toJS());
    return nodeArray;
  });
  return h.apply(this, node.toList().toJS()[0]);
};

export function initialUI() {

  // if (localStorage.getItem('todos')) {
  //   ui = JSON.parse(localStorage.getItem('todos'));
  // };

  return fromJS(ui, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });
}
