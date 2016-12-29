import { API_BASE_URL } from '.././config';

export const REQUEST_SYSTEM_SETTINGS = 'REQUEST_SYSTEM_SETTINGS';
export const RECEIVE_SYSTEM_SETTINGS = 'RECEIVE_SYSTEM_SETTINGS';

export function fetchSystemSettings () {
  return (dispatch, getState) => {
    dispatch(requestSystemSettings());
    const token = getState().user.jwt_token;

    return fetch(`${API_BASE_URL}/system?token=${token}`)
      .then((response) => response.json())
      .then((json) => dispatch(receiveSystemSettings(json)));
  };
}

function requestSystemSettings () {
  return {
    type: REQUEST_SYSTEM_SETTINGS
  };
}

function receiveSystemSettings (json) {
  return {
    type: RECEIVE_SYSTEM_SETTINGS,
    data: json,
    receivedAt: Date.now()
  };
}

export function toggleSongRequests (isEnabled) {
  return (dispatch, getState) => {
    const token = getState().user.jwt_token;
    return fetch(`${API_BASE_URL}/system/requestsToggle/${isEnabled}?token=${token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => dispatch(fetchSystemSettings()));
  };
}
