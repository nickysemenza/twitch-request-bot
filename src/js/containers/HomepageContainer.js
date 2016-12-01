import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMe, signInUser } from '../actions/users';
import { fetchSongQueue, addSong, selectNowPlaying } from '../actions/song';
import Homepage from '../components/Homepage.js';

function mapStateToProps(state) {
  return {
    user: state.user ? state.user.me : null,
    auth: (state.user.status=='authenticated' && state.user.me!=null),
    queue: state.song.queue,
    isAdmin: state.user.token_data ? state.user.token_data.roles.includes('admin') : false
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
