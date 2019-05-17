import FetchWrapper from '../common/utils/FetchWrapper'

export default function reducer(
    state = {
        user: {
            // user_id: null,
            // name: null,
            // email: null,
            // password:null,
            loggedIn: localStorage.getItem('token') ? true : false,
            username: localStorage.getItem('username') ? localStorage.getItem('username') : ''        
        },
        fetching: false,
        fetched: false,
        error: null,
    }, action) {


    switch (action.type) {

        case 'FETCH_USER': {
            return { ...state, fetching: true, feched: true, user: action.payload  };
        }
        case 'FETCH_USER_REJECTED': {

            return { ...state, fetched: false, error: action.payload };
        }
        case 'FETCH_USER_FULFILLED': {

            return { ...state, fetching: false, feched: true, user: action.payload }
        }
        case 'SUBSCRIBE_USER': {

            return { ...state, fetching: false, feched: true, user: action.payload }
        }
        case 'DELETE_USER': {

            return { ...state, fetching: false, feched: true, user: action.payload }
        }

        case 'USER_SUBSCRIBED':
        // updated['loggedIn'] = true;
        // updated['username'] = action.username;
  
        // return updated;
        return { ...state, loggedIn:true,username:payload.username,fetching: false, feched: true, user: action.payload }

      case 'USER_LOGGEDIN':
        // updated['loggedIn'] = true;
        // updated['username'] = action.username;
        // return updated;
        return { ...state, loggedIn:true,username:payload.username,fetching: false, feched: true, user: action.payload }

      case 'USER_LOGOUT':
        // updated['loggedIn'] = false;
        // updated['username'] = '';
        // return updated;
        return { ...state, loggedIn:false,username:'',fetching: false, feched: true, user: action.payload }

  
    }
    return state

}