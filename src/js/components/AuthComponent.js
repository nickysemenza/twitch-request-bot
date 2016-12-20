import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

class AuthComponent extends React.Component {
  render() {
    return <h1>loading...</h1>;
  }
  componentDidMount() {
    this.props.processJWT(this.props.jwt);
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(nextProps.user.status === 'authenticated' ){//&& nextProps.user.user && !nextProps.user.error) {
      // this.props.history.push('/');
      this.props.getMe();
      console.log('we in');
      browserHistory.push('/');
    }

    //TODO: error

  }
}
export default AuthComponent;
