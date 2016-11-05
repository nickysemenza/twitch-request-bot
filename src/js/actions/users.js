import axios from 'axios';
import {API_BASE_URL} from '.././config';
import {TWITCH_CLIENT_ID} from '.././config';

//Sign In User
export const SIGNIN_USER = 'SIGNIN_USER';
export const SIGNIN_USER_SUCCESS = 'SIGNIN_USER_SUCCESS';
export const SIGNIN_USER_FAILURE = 'SIGNIN_USER_FAILURE';

//log out user
export const LOGOUT_USER = 'LOGOUT_USER';

export const REQUEST_ME = 'REQUEST_ME';
export const RECEIVE_ME = 'RECEIVE_ME';

export function fetchMe() {
  return (dispatch, getState) => {
    dispatch(requestMe());
    const token = getState().user.jwt_token;

    return fetch(`${API_BASE_URL}/users/me?token=${token}`)
      .then(response => response.json())
      .then(json => dispatch(receiveMe(json)))
  }
}

function requestMe() {
  return {
    type: REQUEST_ME,
  }
}

function receiveMe(json) {
  return {
    type: RECEIVE_ME,
    me: json,
    receivedAt: Date.now()
  }
}

export function signInUser() {
  window.location=`https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${API_BASE_URL}/twitch_cb&scope=user_read&state=aaa`;
  return {
    type: SIGNIN_USER
  };
}

export function signInUserSuccess(user) {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: user
  };
}

export function signInUserFailure(error) {
  return {
    type: SIGNIN_USER_FAILURE,
    payload: error
  };
}

export function logoutUser() {
  // localStorage.removeItem('id_token');
  return {
    type: LOGOUT_USER
  };
}
