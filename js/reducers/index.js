import {combineReducers} from 'redux'
import userReducer from './userReducer'
import visibilityReducers  from './visibilityReducers'
import ntdTransferReducer  from './ntdTransfer/ntdTransferReducer'
import accountingReducer from './accounting/accountingReducer'
export default combineReducers({
    accountingReducer,
    ntdTransferReducer,
    userReducer,
    visibilityReducers
})