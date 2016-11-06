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

export const ADD_SONG_REQUEST = 'ADDSONG_REQUEST';
export const ADD_SONG_REQUEST_SUCCESS = 'ADDSONG_REQUEST_SUCCESS';
export function addSong() {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    const fields = getState().form.songrequest.values;
    dispatch(requestAddSong(fields));

    return fetch(`${API_BASE_URL}/song?token=${token}`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fields)
    })
      .then(response => response.json())
      .then(json => dispatch(requestAddSongSuccess(json)))
  }
}

function requestAddSong(options) {
  return {
    type: ADD_SONG_REQUEST,
    options: options
  }
}

function requestAddSongSuccess(json) {
  return {
    type: ADD_SONG_REQUEST_SUCCESS,
    receivedAt: Date.now()
  }
}
