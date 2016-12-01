import React, { Component, PropTypes } from 'react';
import {APIget} from '../Utils';
import SongQueue from './SongQueue';
import SongQueueVideo from './SongQueueVideo';
import TwitchLogin from './TwitchLogin';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import SongRequestForm from './SongRequestForm';
export default class Homepage extends Component {



  constructor(props) {
    super(props);
    this.state = {shouldAutoPlay: false};
  }


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

    let queueControls = (
      <div>
        <button className="button-primary-wide" onClick={this.props.nowPlayingFirst}>play first</button>
        <br/>
        <button className="button-primary-wide" onClick={this.props.nowPlayingRandom}>play random</button>
      </div>
    );
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


              <Panel header={<h3>Song requests</h3>} style={{color: "black"}}>
                {this.props.auth ?
                <div>
                  <p>{this.props.user.has_unplayed_song ? "Note: you currently have a song in the queue - requesting another song will replace it but maintain position." : ""}</p>
                  <SongRequestForm onSubmit={this.handleSubmit} creditBalance={this.props.user.credits} />
                </div> : <div>login to request songs!</div>}
              </Panel>

              {/*todo: only show if now playing*/}
              <p>{nowPlaying ? `Now playing: ${nowPlaying.title}` : ''}</p>
              {/*Autoplay?<input type="checkbox" defaultChecked={this.state.shouldAutoPlay} />*/}
              <SongQueueVideo song={nowPlaying ? nowPlaying.youtube_id : null} autoplay={this.props.isAdmin && this.state.shouldAutoPlay}/>

            </Col>
            <Col sm={6} md={6}>
              {this.props.isAdmin ? queueControls : ""}
              <h2>Song Request Queue</h2>
              <SongQueue queue={this.props.queue} play={this.props.nowPlayingID} isAdmin={this.props.isAdmin}/>
            </Col>
          </Row>
        </Grid>



    </div>);
  }
}
