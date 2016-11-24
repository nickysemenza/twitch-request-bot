import React, { Component } from 'react';

export default class TwitchLogin extends Component {

  render() {
    return <img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" className="twitch-connect" onClick={this.props.action} />;
  }
}
