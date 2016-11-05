import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'

// const AuthComponent = function(todos, onTodoClick) {
//   // this.props.onTodoClick("test");
//   this.props.onTodoClick();
//   return <h1>hi</h1>
// }
//


class AuthComponent extends React.Component {
  render() {
    return <h1>loading...</h1>
  }
  componentDidMount() {
    this.props.processJWT(this.props.jwt);
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(nextProps.user.status === 'authenticated' ){//&& nextProps.user.user && !nextProps.user.error) {
      // this.props.history.push('/');
      console.log('we in');
      browserHistory.push('/');
    }

    //error
    //Throw error if it was not already thrown (check this.props.user.error to see if alert was already shown)
    //If u dont check this.props.user.error, u may throw error multiple times due to redux-form's validation errors
    // if(nextProps.user.status === 'signin' && !nextProps.user.user && nextProps.user.error && !this.props.user.error) {
    //   alert(nextProps.user.error.message);
    // }
  }
}
export default AuthComponent
