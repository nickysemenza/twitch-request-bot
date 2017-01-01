
import {
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAILURE,
  LOGOUT_USER,
  REQUEST_ME,
  RECEIVE_ME,
  REQUEST_USER_LIST,
  RECEIVE_USER_LIST
} from '../actions/users';

import { decodeJWT } from '../Utils';

const INITIAL_STATE = { user: null, status:null, error:null, loading: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case SIGNIN_USER_SUCCESS:// return authenticated user,  make loading = false and status = authenticated
      return { ...state, token: action.payload.token, status:'authenticated', jwt_token: action.payload, error:null, loading: false, token_data: decodeJWT(action.payload) }; // <-- authenticated
    case SIGNIN_USER_FAILURE:// return error and make loading = false
      error = action.payload.data || { message: action.payload.message };// 2nd one is network or server down errors
      return { ...state, me: null, status:'signin', error:error, loading: false };

    case REQUEST_ME:
      return { ...state,
        isFetching: true,
        didInvalidate: false
      };
    case RECEIVE_ME:
      if (action.error) {
        return state;
      }
      return { ...state,
        isFetching: false,
        didInvalidate: false,
        me: action.me,
        lastUpdated: action.receivedAt
      };

    case REQUEST_USER_LIST:
      return { ...state,
        isFetchingUserList: true
      };
    case RECEIVE_USER_LIST:
      return { ...state,
        isFetchingUserList: false,
        user_list: action.users,
        lastUpdated: action.receivedAt
      };

    case LOGOUT_USER:
      return { ...state, me: null, status:'logout', jwt_token: null, error:null, loading: false, token_data:null };

    default:
      return state;
  }
}
