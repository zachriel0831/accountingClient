export default function reducer(
    state = {
        accounting: {
            name: null,
            amount: null,
            date: null,
            remark:null,
            user:null,
        },
        fetching: false,
        fetched: false,
        error: null,
    }, action) {


    switch (action.type) {

        case 'FETCH_ACCOUNT': {
            return {...state,fetching:true};
        }
        case 'FETCH_ACCOUNT_REJECTED': {

            return {...state,fetched:false,error:action.payload};
        }
        case 'FETCH_ACCOUNT_FULLFILLED': {

            return {...state,fetching:false,feched:true,user:action.payload}
        }


    }
    return state

}