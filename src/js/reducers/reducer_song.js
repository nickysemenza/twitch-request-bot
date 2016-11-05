
import {
  REQUEST_SONGQUEUE,
  RECEIVE_SONGQUEUE
} from '../actions/song';

const INITIAL_STATE = {queue: null, error:null, loading: false};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {
    case REQUEST_SONGQUEUE:
      return { ...state,
        isFetching: true,
        didInvalidate: false
      };
    case RECEIVE_SONGQUEUE:
      return { ...state,
        isFetching: false,
        didInvalidate: false,
        queue: action.queue,
        lastUpdated: action.receivedAt
      };
    default:
    return state;
  }
}
