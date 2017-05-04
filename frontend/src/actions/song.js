import { API_BASE_URL } from 'config';

export const REQUEST_SONGQUEUE = 'REQUEST_SONGQUEUE';
export const RECEIVE_SONGQUEUE = 'RECEIVE_SONGQUEUE';

export function fetchSongQueue () {
  return (dispatch, getState) => {
    dispatch(requestSongQueue());
    const token = getState().user.jwt_token;

    return fetch(`${API_BASE_URL}/songqueue?token=${token}`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveSongQueue(json)));
  };
}

function requestSongQueue () {
  return {
    type: REQUEST_SONGQUEUE
  };
}

function receiveSongQueue (json) {
  return {
    type: RECEIVE_SONGQUEUE,
    queue: json,
    receivedAt: Date.now()
  };
}

export const ADD_SONG_REQUEST = 'ADDSONG_REQUEST';
export const ADD_SONG_REQUEST_SUCCESS = 'ADDSONG_REQUEST_SUCCESS';
export function addSong (formData) {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    dispatch(requestAddSong(formData));
    return fetch(`${API_BASE_URL}/song?token=${token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((json) => dispatch(requestAddSongSuccess(json)));
  };
}

function requestAddSong (options) {
  return {
    type: ADD_SONG_REQUEST,
    options: options
  };
}

function requestAddSongSuccess (json) {
  return {
    type: ADD_SONG_REQUEST_SUCCESS,
    receivedAt: Date.now()
  };
}

export function selectNowPlaying (mode, id) {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    return fetch(`${API_BASE_URL}/song/play/${mode}/${id}?token=${token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => dispatch(fetchSongQueue()));
  };
}

export function deleteFromQueue (mode, id) {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    return fetch(`${API_BASE_URL}/song/delete/${mode}/${id}?token=${token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => dispatch(fetchSongQueue()));
  };
}
