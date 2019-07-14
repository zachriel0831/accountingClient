export default function reducer(
    state = {
        accountDetail: [{
            user_id: '',
            itemName: '',
            date: '',
            displayYear: '',
            displayMonth: '',
            displayDay: '',
            category: '',
            amount: '',
            sourceFlag: '',
            remark: '',
        }],
        fetching: false,
        fetched: false,
        error: null,
    }, action) {


    switch (action.type) {

        case 'FETCH_ACCOUNT': {
            //debugger

            return {...state,fetching:true,accountDetail:[]};
        }
        case 'FETCH_ACCOUNT_REJECTED': {
            //debugger

            return {...state,fetched:false,error:action.payload,accountDetail:[]};
        }
        case 'FETCH_ACCOUNT_FULLFILLED': {
            //debugger

            return {...state,fetching:false,feched:true,accountDetail:action.payload}
        }

        case 'NEW_ACCOUNT':{
            //debugger

            return {...state,fetching:true,accountDetail:[]};
        }

        case 'NEW_ACCOUNT_PENDING':{
            //debugger

            return {...state,fetched:false,error:action.payload};

        }

        case 'NEW_ACCOUNT_REJECTED':{
            return {...state,fetched:false,error:action.payload,accountDetail:[]};
        }

        case 'NEW_ACCOUNT_FULFILLED':{
            //debugger

            return {...state,fetching:false,feched:true,accountDetail:action.payload}
        }


    }
    return state

}