import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserList, giveUserCredits} from '../actions/users';
import AdminUsers from '../components/AdminUsers.js';

function mapStateToProps(state) {
  return {
    user_list: state.user.user_list
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadUserList: () => {
      dispatch(fetchUserList());
    },
    giveCredits: (user_id, points) => {
      dispatch(giveUserCredits(user_id, points));
    },
  });

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
