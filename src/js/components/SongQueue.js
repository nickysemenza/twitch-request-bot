import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class SongQueue extends Component {

  truncString = (str, max, add='...') => {
    return (typeof str === 'string' && str.length > max ? str.substring(0,max)+add : str);
  };
  render() {
    var list;

    if(this.props.queue)
      list = this.props.queue.map(function(song){
        let stripeClass = "songListElementStripe";
        if(song.priority) stripeClass = "songListElementStripe-priority";
        if(song.status==1) stripeClass = "songListElementStripe-nowPlaying";
        let isCustomInstrument = (song.instrument != "" && song.instrument != null);
        let customInstrument = isCustomInstrument ? <div><FontAwesome name='music' /> played on ${song.instrument}</div> : null;
        let youtubeLink = <a href={"https://www.youtube.com/watch?v="+song.youtube_id} target="_blank">{this.truncString(song.title,50)}</a>;
        let adminButton = (song.status == 0 && this.props.isAdmin) ? <button className="button-primary" onClick={() => this.props.play(song.id)}>play now</button> : null;
        return (
          <div key={song.id} className="songListElementWrapper">
            <div className={stripeClass}>
              {song.priority ? <FontAwesome name='star' /> : ''}
            </div>
            <div className="songListElementContent">
              <div>
                <FontAwesome name='youtube-play' />
                {youtubeLink}
              </div>
              <div>
                {customInstrument}
              </div>
              <div>
                <FontAwesome name='user' />
                {song.user.username}
              </div>
              {adminButton}
            </div>
          </div>
        );
      },this);

    return(
      <div>
      {list}
      </div>);
  }
}
