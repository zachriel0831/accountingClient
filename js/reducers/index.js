import {combineReducers} from 'redux'
import userReducer from './userReducer'
import accountingReducer from './accounting/accountingReducer'

export default combineReducers({
    accountingReducer,
    userReducer,
})