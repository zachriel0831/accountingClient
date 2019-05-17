// import { VisibilityFilters } from '../actions'
// const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter
//     default:
//       return state
//   }
// }
// export default visibilityFilter

import utils from '../common/utils/utils';
export default function reducer(
  state = {
    visibilityFilters:'',
    loggedIn:false,
    navs:utils.changeView(),
  }, action) {

  switch (action.type) {
      case 'SET_VISIBILITY_FILTER': {
          return { ...state,navs:action.payload, visibilityFilters:action.filter,loggedIn:true};
      }
  }
  return state
}