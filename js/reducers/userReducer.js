
export default function reducer(
    state = {
        user: {
            user_id: '',
            name: '',
            phone: '',
            email: '',
            password: ''
        },
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
        userDetail: [{
            id: '',
            name: '',
            password: '',
            email: ''
        }],
        fetching: false,
        fetched: false,
        error: null,
        loggedIn: false
    }, action) {


    switch (action.type) {

        case 'HOME_INITIALIZING': {
            

            return { ...state, userDetail: state.userDetail, accountDetail: state.accountDetail, fetching: true, fetched: true };
        }

        case 'HOME_INITIALIZING_REJECTED': {
            

            return { ...state, fetched: false, error: action.payload };
        }

        case 'HOME_INITIALIZING_PENDING': {
            

            return { ...state, fetching: true, fetched: false };
        }
        case 'HOME_INITIALIZING_FULFILLED': {
            

            return {
                ...state, fetching: false, fetched: true,
                userDetail: action.payload.userDetail, accountDetail: action.payload.accountDetail, loggedIn: true
            }
        }
        case 'SUBSCRIBE_USER': {

            return { ...state, fetching: true, fetched: false, }
        }
        case 'SUBSCRIBE_USER_PENDING': {
            return { ...state, fetching: true, fetched: false, loggedIn: false }

        }
        case 'SUBSCRIBE_USER_FULFILLED':
            return { ...state, fetching: false, fetched: true, loggedIn: false }

        case 'DELETE_USER': {

            return { ...state, fetching: false, fetched: true, user: action.payload }
        }

        case 'USER_LOGGEDIN':

            return { ...state, fetching: true, fetched: false, data: action.payload, loggedIn: false }

        case 'USER_LOGGEDIN_PENDING': {

            return { ...state, fetching: true, fetched: false, data: action.payload, loggedIn: false }

        }
        case 'USER_LOGGEDIN_FULFILLED':

            return { ...state, fetching: false, fetched: true, data: action.payload, loggedIn: true }

        case 'USER_LOGOUT':
            return {
                ...state, fetching: false, fetched: true, user: {
                    user_id: '',
                    name: '',
                    email: '',
                    password: '',
                    phone: ''
                }, userDetail: '', accountDetail: '', loggedIn: false
            }
        case 'USER_SUBSCRIBE_REJECTED': {
            return { ...state, fetched: false, error: action.payload, loggedIn: false };
        }

    }
    return state

}