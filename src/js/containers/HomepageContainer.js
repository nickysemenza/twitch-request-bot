import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMe, signInUser } from '../actions/users';
import Homepage from '../components/Homepage.js';

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadData: () => {
      dispatch(fetchMe());
    },
    signin: () => {
      dispatch(signInUser());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
