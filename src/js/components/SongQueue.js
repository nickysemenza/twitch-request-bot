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
        return (
          <div key={song.id} className="songListElementWrapper">
            <div className={stripeClass}>{song.priority ? <FontAwesome name='star' /> : ''}</div>
            <div className="songListElementContent">
              <div><FontAwesome name='youtube-play' /> <a href={"https://www.youtube.com/watch?v="+song.youtube_id} target="_blank">{this.truncString(song.title,50)}</a></div>
              <div><FontAwesome name='music' /> {song.instrument != "" ? (`played on ${song.instrument}`) : "piano"}</div>
              <div><FontAwesome name='user' /> {song.user.username}</div>
              {(song.status==0 && this.props.isAdmin) ? <button className="button-primary" onClick={() => this.props.play(song.id)}>play now</button> : ''}
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
