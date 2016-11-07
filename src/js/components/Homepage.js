import React, { Component, PropTypes } from 'react';
import {APIget} from '../Utils';
import SongQueue from './SongQueue';
import SongQueueVideo from './SongQueueVideo';
import TwitchLogin from './TwitchLogin';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import SongRequestForm from './SongRequestForm';
export default class Homepage extends Component {


  handleSubmit = (values) => {
    // Do something with the form values
    this.props.addSong(values);
    //grr hacky
    setTimeout(() => {
      this.props.loadSongQueue();
    }, 1000);
  };

  // componentDidMount = () => {
  //   setInterval(() => {
  //     this.props.loadSongQueue();
  //   }, 900);
  // };

  render() {
    var nowPlaying = this.props.queue ? this.props.queue.find(function(queue){return queue.status === 1;}) : null;
    return(
      <div>

        <Grid>
          <Row className="show-grid">
            <Col sm={6} md={6}>
              {this.props.auth ? `You have ${this.props.user.credits} request credits` : <TwitchLogin action={this.props.signin}/>}
              <br/>
              <button className="button-primary-wide" onClick={this.props.loadDataUser}>[debugreload] user</button>
              <br/>
              <button className="button-primary-wide" onClick={this.props.loadSongQueue}>[debugreload] queue</button>


              <Panel header={<h3>Song requests</h3>}>
                <SongRequestForm onSubmit={this.handleSubmit} />
              </Panel>

              {/*todo: only show if now playing*/}
              <p>{nowPlaying ? `Now playing: ${nowPlaying.title}` : ''}</p>
              <SongQueueVideo song={nowPlaying ? nowPlaying.youtube_id : null} autoplay={this.props.isAdmin}/>

            </Col>
            <Col sm={6} md={6}>
              <button className="button-primary-wide" onClick={this.props.nowPlayingFirst}>play first</button>
              <br/>
              <button className="button-primary-wide" onClick={this.props.nowPlayingRandom}>play random</button>
              <h2>Song Request Queue</h2>
              <SongQueue queue={this.props.queue} play={this.props.nowPlayingID}/>
            </Col>
          </Row>
        </Grid>



    </div>);
  }
}
