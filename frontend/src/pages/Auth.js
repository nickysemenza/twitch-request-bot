import React, { Component } from 'react';
import AuthContainer from '../containers/AuthContainer';
import HeaderContainer from '../containers/HeaderContainer';

class AuthPage extends Component {
  render () {
    return (
      <div>
        <HeaderContainer />
        <AuthContainer jwt={this.props.location.query.jwt} />
      </div>
    );
  }
}
export default AuthPage;
