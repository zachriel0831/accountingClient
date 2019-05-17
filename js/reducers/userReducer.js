
export default function reducer(
    state = {
        user: {
            user_id: '',
            name: '',
            email: '',
            password: ''
        },
        fetching: false,
        fetched: false,
        error: null,
        loggedIn:false
    }, action) {


    switch (action.type) {

        case 'FETCH_USER': {
            

            return { ...state, fetching: true, fetched: true};
        }

        case 'FETCH_USER_REJECTED': {

            return { ...state, fetched: false, error: action.payload };
        }

        case 'FETCH_USER_PENDING': {
            
            return { ...state, fetching: true, fetched: false};
        }
        case 'FETCH_USER_FULFILLED': {
            

            return { ...state, fetching: false, fetched: true, user: action.payload ,loggedIn:true}
        }
        case 'SUBSCRIBE_USER': {
            
            return { ...state, fetching: true, fetched: false, user: action.payload }
        }
        case 'SUBSCRIBE_USER_PENDING':{
            return { ...state, fetching: true, fetched: false, user: action.payload, loggedIn: false }

        }
        case 'SUBSCRIBE_USER_FULFILLED':
            return { ...state, fetching: false, fetched: true, user: action.payload, loggedIn: true }

        case 'DELETE_USER': {

            return { ...state, fetching: false, fetched: true, user: action.payload }
        }


        case 'USER_LOGGEDIN':
        
            return { ...state, fetching: true, fetched: false, user: action.payload, loggedIn: false }

        case 'USER_LOGGEDIN_PENDING':{
            
            return { ...state, fetching: true, fetched: false, user: action.payload, loggedIn: false }
    
        }
        case 'USER_LOGGEDIN_FULFILLED':
        
        return { ...state, fetching: false, fetched: true, user: action.payload, loggedIn: true }

        case 'USER_LOGOUT':
            return { ...state, fetching: false, fetched: true, user: {}, loggedIn: false }

        case 'USER_SUBSCRIBE_REJECTED': {

            return { ...state, fetched: false, error: action.payload, loggedIn: false };
        }

    }
    return state

}