import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMe, signInUser } from '../actions/users';
import { fetchSongQueue, addSong, selectNowPlaying, deleteFromQueue } from '../actions/song';
import { toggleSongRequests, fetchSystemSettings } from '../actions/system';
import Homepage from '../components/Homepage.js';
import {reset} from 'redux-form';

function mapStateToProps(state) {
  return {
    user: state.user ? state.user.me : null,
    auth: (state.user.status=='authenticated' && state.user.me!=null),
    queue: state.song.queue,
    isAdmin: state.user.token_data ? state.user.token_data.roles.includes('admin') : false,
    requests_enabled: state.system.system ? state.system.system.settings.requests_enabled : false
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadDataUser: () => {
      dispatch(fetchMe());
    },
    signin: () => {
      dispatch(signInUser());
    },
    loadSongQueue: () => {
      dispatch(fetchSongQueue());
    },
    addSong: (details) => {
      dispatch(addSong(details));
    },
    nowPlayingID: (id) => {
      dispatch(selectNowPlaying("specific",id));
    },
    nowPlayingFirst: () => {
      dispatch(selectNowPlaying("first",0));
    },
    nowPlayingRandom: () => {
      dispatch(selectNowPlaying("random",0));
    },
    deleteID: (id) => {
      dispatch(deleteFromQueue("specific",id));
    },
    deleteAll: () => {
      dispatch(deleteFromQueue("all",0));
    },
    enableSongRequests: () => {
      dispatch(toggleSongRequests(true));
    },
    disableSongRequests: () => {
      dispatch(toggleSongRequests(false));
    },
    loadSystem: () => {
      dispatch(fetchSystemSettings());
    },
    resetRequestForm: () => {
      dispatch(reset('songrequest'));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
