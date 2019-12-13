
import utils from '../common/utils/utils';
import MainRouter from '../common/utils/Router';
export default function reducer(
  state = {
    visibilityFilters:'',
    loggedIn:false,
    navs:utils.changeMenuView('',MainRouter),
  }, action) {
    
  switch (action.type) {
      case 'SET_VISIBILITY_FILTER': {
          return { ...state,navs:action.payload, visibilityFilters:action.filter,loggedIn:true};
      }
  }
  return state
}