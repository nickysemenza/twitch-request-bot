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

export const REQUEST_USER_LIST = 'REQUEST_USER_LIST';
export const RECEIVE_USER_LIST = 'RECEIVE_USER_LIST';

export function fetchUserList() {
  return (dispatch, getState) => {
    dispatch(requestUserList());
    const token = getState().user.jwt_token;

    return fetch(`${API_BASE_URL}/users?token=${token}`)
      .then(response => response.json())
      .then(json => dispatch(receiveUserList(json)))
  }
}

function requestUserList() {
  return {
    type: REQUEST_USER_LIST,
  }
}

function receiveUserList(json) {
  return {
    type: RECEIVE_USER_LIST,
    users: json
  }
}

export function giveUserCredits(id, points) {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    return fetch(`${API_BASE_URL}/users/${id}/givecredits/${points}?token=${token}`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => dispatch(fetchUserList()))
  }
}


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
