import {mainSectionComponent} from './components/mainSectionComponent';
import {headerComponent} from './components/headerComponent';
import {footerComponent} from './components/footerComponent';

export const todoMvcUi = {
  ui: {
    'div#todoapp': {
      'section.todoapp': {
        'header.header': headerComponent,
        'section.main': mainSectionComponent,
        'footer.footer': footerComponent
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
  },
  routes: {
    'all': {
      dispatch: {
        type: 'FILTER_TODOS',
        view: 'all'
      }
    },
    'completed': {
      dispatch: {
        type: 'FILTER_TODOS',
        view: 'completed'
      }
    },
    'active': {
      dispatch: {
        type: 'FILTER_TODOS',
        view: 'active'
      }
    }
  }
}


