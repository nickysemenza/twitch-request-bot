import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class SongQueue extends Component {

  render() {
    var list;
    if(this.props.queue)
      list = this.props.queue.map(function(song){
        return (<div key={song.id} className={song.status==1 ? 'songListElement songListElement-nowPlaying' : 'songListElement'}>
          <a href={"https://www.youtube.com/watch?v="+song.youtube_id} target="_blank">{song.title}</a>
          <p>requested by {song.user.username} {song.priority ? <FontAwesome name='star' /> : ''}</p>
          {song.status==0 ? <button className="button-primary" onClick={() => this.props.play(song.id)}>play now</button> : ''}
          <p>(id={song.id})</p>
        </div>);
      },this);

    return(<div>{list}</div>);
  }
}
