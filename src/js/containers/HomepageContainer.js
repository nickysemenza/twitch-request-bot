import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMe, signInUser } from '../actions/users';
import { fetchSongQueue } from '../actions/song';
import Homepage from '../components/Homepage.js';

function mapStateToProps(state) {
  return {
    user: state.user ? state.user.me : null,
    auth: (state.user.status=='authenticated' && state.user.me!=null),
    queue: state.song.queue,
    isAdmin: state.user.token_data ? state.user.token_data.roles.includes('admin'): false
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
