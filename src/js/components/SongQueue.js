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
        // return (
        //  <div key={song.id} className={song.status==1 ? 'songListElement songListElement-nowPlaying' : 'songListElement'}>
        //   <a href={"https://www.youtube.com/watch?v="+song.youtube_id} target="_blank">{song.title}</a>
        //   <p>requested by {song.user.username} {song.priority ? <FontAwesome name='star' /> : ''}</p>
        //   {song.status==0 ? <button className="button-primary" onClick={() => this.props.play(song.id)}>play now</button> : ''}
        //   <p>(id={song.id})</p>
        // </div>
        // );
        return (
          <div key={song.id} className="songListElementWrapper">
            <div className={song.status==1 ? 'songListElementStripe songListElementStripe-nowPlaying' : 'songListElementStripe'}>{song.priority ? <FontAwesome name='star' /> : ''}</div>
            <div className="songListElementContent">
              {song.id} | <a href={"https://www.youtube.com/watch?v="+song.youtube_id} target="_blank">{this.truncString(song.title,50)}</a>
              <p>requested by {song.user.username} </p>
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
