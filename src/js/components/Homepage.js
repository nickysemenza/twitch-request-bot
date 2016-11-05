import React, { Component, PropTypes } from 'react';
import {APIget} from '../Utils';
import SongQueue from './SongQueue';
import SongQueueVideo from './SongQueueVideo';
import TwitchLogin from './TwitchLogin';
import {Grid, Row, Col} from 'react-bootstrap';
export default class Homepage extends Component {

  render() {
    var nowPlaying = this.props.queue.find(function(queue){return queue.status === 1;});
    return(
      <div>

        <Grid>
          <Row className="show-grid">
            <Col sm={6} md={6}>
              {this.props.auth ? `You have ${this.props.user.credits} request credits` : <TwitchLogin action={this.props.signin}/>}
              <br/>
              <button className="button-primary-wide" onClick={this.props.loadDataUser}>Reload User</button>
              <br/>
              <button className="button-primary-wide" onClick={this.props.loadSongQueue}>Reload SongQueue</button>
              <SongQueueVideo song={nowPlaying.youtube_id} autoplay={this.props.isAdmin}/>

            </Col>
            <Col sm={6} md={6}>
              <h2>Song Request Queue</h2>
              <SongQueue queue={this.props.queue}/>
            </Col>
          </Row>
        </Grid>



    </div>);
  }
}
