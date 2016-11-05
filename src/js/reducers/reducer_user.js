
import {
  ME_FROM_TOKEN, ME_FROM_TOKEN_SUCCESS, ME_FROM_TOKEN_FAILURE, RESET_TOKEN, RESET_USER,
	SIGNIN_USER, SIGNIN_USER_SUCCESS,  SIGNIN_USER_FAILURE,
	LOGOUT_USER
} from '../actions/users';

import { decodeJWT } from '../Utils'


const INITIAL_STATE = {user: null, status:null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
  let error;
  // console.log('entering reducer',action);
  switch(action.type) {

    case ME_FROM_TOKEN:// loading currentUser("me") from jwttoken in local/session storage storage,
    return { ...state, user: null, status:'storage', error:null, loading: true};
    case ME_FROM_TOKEN_SUCCESS://return user, status = authenticated and make loading = false
    return { ...state, user: action.payload.data, status:'authenticated', error:null, loading: false}; //<-- authenticated
    case ME_FROM_TOKEN_FAILURE:// return error and make loading = false
     error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, user: null, status:'storage', error:error, loading: false};

    case SIGNIN_USER_SUCCESS://return authenticated user,  make loading = false and status = authenticated
      localStorage.setItem('id_token', action.payload);
    return { ...state, token: action.payload.token, status:'authenticated', error:null, loading: false, data: decodeJWT(action.payload)}; //<-- authenticated
    case SIGNIN_USER_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, user: null, status:'signin', error:error, loading: false};



    case LOGOUT_USER:
      localStorage.removeItem('id_token');
      return {...state, user:null, status:'logout', error:null, loading: false};

    case RESET_USER:// reset authenticated user to initial state
    return { ...state, user: null, status:null, error:null, loading: false};

    default:
    return state;
  }
}
