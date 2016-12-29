import React, { Component } from 'react';
import YouTube from 'react-youtube';

export default class SongQueueVideo extends Component {

  render() {
    var videoid = this.props.song;
    const opts = {
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false
      }
    };
    let player = (<YouTube
      videoId={videoid}
      opts={opts}
    />);
    return(videoid ? player : null);
  }
}
