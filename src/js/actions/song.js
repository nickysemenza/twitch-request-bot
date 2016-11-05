import {API_BASE_URL} from '.././config';
import {TWITCH_CLIENT_ID} from '.././config';


export const REQUEST_SONGQUEUE = 'REQUEST_SONGQUEUE';
export const RECEIVE_SONGQUEUE = 'RECEIVE_SONGQUEUE';

export function fetchSongQueue() {
  return (dispatch, getState) => {
    dispatch(requestSongQueue());
    const token = getState().user.jwt_token;

    return fetch(`${API_BASE_URL}/songqueue?token=${token}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSongQueue(json)))
  }
}

function requestSongQueue() {
  return {
    type: REQUEST_SONGQUEUE,
  }
}

function receiveSongQueue(json) {
  return {
    type: RECEIVE_SONGQUEUE,
    queue: json,
    receivedAt: Date.now()
  }
}
