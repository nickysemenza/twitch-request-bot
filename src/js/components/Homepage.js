import React, { Component, PropTypes } from 'react';
import {APIget} from '../Utils';
import PrettyJSON from './PrettyJSON';
import TwitchLogin from './TwitchLogin';
export default class Homepage extends Component {

  render() {
    return(
      <div>
      <TwitchLogin action={this.props.signin}/>
      <PrettyJSON data={this.props.user}/>
      <button className="button-primary-wide" onClick={this.props.loadData}>Reload Data</button>
    </div>);
  }
}
