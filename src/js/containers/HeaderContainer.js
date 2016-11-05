import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/users';
import { signInUser } from '../actions/users';
import MainNavBar from '../components/Nav.js';


function mapStateToProps(state) {
  return {
    isAuthenticated: state.user.status=='authenticated' && state.user.me,
    user: state.user,
    username: state.user.me ? state.user.me.username : 'naa'

  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => {
      dispatch(logoutUser());
    },
    signin: () => {
      dispatch(signInUser());
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MainNavBar);
