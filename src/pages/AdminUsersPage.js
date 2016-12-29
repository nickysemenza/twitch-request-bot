import React, { Component } from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import AdminUserContainer from '../containers/AdminUserContainer';
class AdminUsersPage extends Component {
  render () {
    return (
      <div>
        <HeaderContainer />
        <AdminUserContainer />
      </div>
    );
  }
}

export default AdminUsersPage;
