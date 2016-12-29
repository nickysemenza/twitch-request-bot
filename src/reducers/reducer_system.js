
import {
  REQUEST_SYSTEM_SETTINGS,
  RECEIVE_SYSTEM_SETTINGS
} from '../actions/system';

const INITIAL_STATE = { system: null, error:null, loading: false };

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case REQUEST_SYSTEM_SETTINGS:
      return { ...state,
        isFetching: true,
        didInvalidate: false
      };
    case RECEIVE_SYSTEM_SETTINGS:
      return { ...state,
        isFetching: false,
        didInvalidate: false,
        system: action.data,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
}
