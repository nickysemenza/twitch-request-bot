import React, { Component } from 'react';
import { connect } from 'react-redux'
import { signInUser, signInUserSuccess, signInUserFailure, resetUserFields, test } from '../actions/users';
import AuthComponent from '../components/AuthComponent';


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    processJWT: (id) => {
      dispatch(signInUserSuccess(id))
    }
  }
}



const AuthContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);

export default AuthContainer
