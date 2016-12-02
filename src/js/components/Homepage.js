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
      this.props.resetRequestForm();
    }, 400);
  };

  loadData = () => {
    this.props.loadSongQueue();
    this.props.loadDataUser();
    this.props.loadSystem();
  };
  componentDidMount = () => {
    this.loadData();
    setInterval(() => {
      this.loadData();
    }, 1400);
  };

  render() {
    var nowPlaying = this.props.queue ? this.props.queue.find(function(queue){return queue.status === 1;}) : null;

    let queueControls = (
      <div>
        <button className="button-primary-wide" onClick={this.props.nowPlayingFirst}>play first</button>
        <br/>
        <button className="button-primary-wide" onClick={this.props.nowPlayingRandom}>play random</button>
        <hr/>
        <br/>
        <button className="button-primary-wide" onClick={this.props.enableSongRequests}>enable requests</button>
        <br/>
        <button className="button-primary-wide" onClick={this.props.disableSongRequests}>disable requests</button>
      </div>
    );

    let isLoggedIn = this.props.auth;
    let requestsEnabled = this.props.requests_enabled;

    let shouldShowSongForm = isLoggedIn && requestsEnabled;
    let songFormHideReason;
    if(!requestsEnabled)
      songFormHideReason = "song requests are not enabled right now!";
    if(!isLoggedIn)
      songFormHideReason = "login to request songs!";
    let songForm = (shouldShowSongForm ?
      <div>
        <p>{this.props.user.has_unplayed_song ? "Note: you currently have a song in the queue - requesting another song will replace it but maintain position." : ""}</p>
        <SongRequestForm onSubmit={this.handleSubmit} creditBalance={this.props.user.credits} />
      </div> : <div>{songFormHideReason}</div>
    );

    return(
      <div>
        <Grid>
          <Row className="show-grid">
            <Col sm={6} md={6}>
              {/*{this.props.auth ? `You have ${this.props.user.credits} request credits` : <TwitchLogin action={this.props.signin}/>}*/}
              {this.props.auth ? "" : <TwitchLogin action={this.props.signin}/>}
              {/*<br/>*/}
              {/*<button className="button-primary-wide" onClick={this.props.loadDataUser}>[debugreload] user</button>*/}
              {/*<br/>*/}
              {/*<button className="button-primary-wide" onClick={this.props.loadSongQueue}>[debugreload] queue</button>*/}

              <Panel header={<h3>Song requests</h3>} style={{color: "black"}}>
                {songForm}
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
          <Row className="show-grid">
            <Col sm={9} md={9}>
              <iframe src="https://player.twitch.tv/?channel=cheeseburger97" frameBorder="0" scrolling="no" height="378" width="620"></iframe>
              {/*<a href="https://www.twitch.tv/cheeseburger97?tt_medium=live_embed&tt_content=text_link" style={"padding":"2px 0px 4px","display":"block","width":"345px","fontWeight":"normal","fontSize":"10px","textDecoration":"underline"}>Watch live video from Cheeseburger97 on www.twitch.tv</a>*/}
            </Col>
            <Col sm={3} md={3}>
              <iframe src="https://www.twitch.tv/cheeseburger97/chat?popout=" frameBorder="0" scrolling="no" height="500" width="350"></iframe>
            </Col>
          </Row>
        </Grid>



    </div>);
  }
}
