import {fromJS, Map, List, Iterable} from 'immutable';
import {getStore} from './../../lib/store';
import {renderUI} from './../../lib/ui';

getStore = jasmine.createSpy('getStore');

describe('the Nux core ui renderer,', () => {
  let renderedUI;
  const testUI = fromJS({
    'div#app': {
      props: {
        style: {
          fontFamily: 'helvetica'
        }
      },
      children: {
        'h1': {
          props: {
            style: {
              fontSize: '20px'
            }
          }
        }
      }
    }
  });

  beforeEach(() => {
    renderedUI = renderUI(testUI);
  });

  it('should turn a Nux DOM object into a virtual DOM object', () => {
    expect(renderedUI).toEqual('');
  });

});
