import {combineReducers} from 'redux'
import userReducer from './userReducer'
// import newAccounting from './newAccountingReducer'
import visibilityReducers  from './visibilityReducers'

export default combineReducers({
    userReducer,
    visibilityReducers
})