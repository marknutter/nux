import h from 'virtual-dom/h';
import getStore from './store';
import {fromJS, Map, List} from 'immutable';

let store = getStore();


let ui = ['div#app',
              {
                style: {
                  fontFamily: 'helvetica'
                }
              },
              [
                ['div#header',
                  {
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
                  ['Oqodo']
                ],
                ['div#posts',
                  {
                    style: {
                      position: 'absolute',
                      left: '0px',
                      right: '0px',
                      top: '40px',
                      bottom: '0px',
                      backgroundColor: "rgba(0,0,0,0.05)"
                    }
                  },
                  [
                    ['form#new-post-form',
                      {
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
                      [
                        ['input',
                          {
                            style: {
                              border: '1px solid #aaa',
                              fontSize: '16px',
                              padding: '5px'
                            },
                            placeholder: 'add new post'
                          }
                        ]
                      ]
                    ],
                    ['div#posts-container',
                      {
                        style: {
                          position: 'absolute',
                          top: '50px',
                          left: '10px'
                        }
                      },
                      []
                    ]
                  ]
                ]
              ]
            ];




export function renderUI (ui, space = "") {
  let node;
  if (ui.map) {
    node = ui.map((arg) => {
      if (List.isList(arg)) {
        return arg.map((n) => {
          return renderUI(n, space + "  ");
        });
      } else {
        return arg.toJS ? arg.toJS() : arg;
      }
    }).toJS()
  } else {
    node = [ui];
  };
  return h.apply(this, node);
};

export function initialUI() {
  return fromJS(ui);
}
