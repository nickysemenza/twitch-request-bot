import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMe, signInUserSuccess } from '../actions/users';
import AuthComponent from '../components/AuthComponent';

const mapStateToProps = (state, ownProps) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  processJWT: (id) => {
    dispatch(signInUserSuccess(id));
  },
  getMe: (id) => {
    dispatch(fetchMe(id));
  }
});

const AuthContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);

export default AuthContainer;
