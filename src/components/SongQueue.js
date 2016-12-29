import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class SongQueue extends Component {

  truncString = (str, max, add = '...') => (typeof str === 'string' && str.length > max ? str.substring(0, max) + add : str);
  render () {
    var list;

    if (this.props.queue) {
      list = this.props.queue.map(function (song) {
        let stripeClass = 'songListElementStripe';
        if (song.priority) stripeClass = 'songListElementStripe-priority';
        if (song.status == 1) stripeClass = 'songListElementStripe-nowPlaying';
        let isCustomInstrument = (song.instrument != '' && song.instrument != null);
        let customInstrument = isCustomInstrument ? <div><FontAwesome name='music' /> played on ${song.instrument}</div> : null;
        let youtubeLink = <a href={'https://www.youtube.com/watch?v=' + song.youtube_id} target='_blank'>{this.truncString(song.title, 50)}</a>;
        let adminButtonPlay = (song.status == 0 && this.props.isAdmin) ? <button className='button-primary' onClick={() => this.props.play(song.id)}>play now</button> : null;
        let adminButtonDelete = (song.status == 0 && this.props.isAdmin) ? <button className='button-primary' onClick={() => this.props.delete(song.id)}>delete</button> : null;
        return (
          <div key={song.id} className='songListElementWrapper'>
            <div className={stripeClass} />
            <div className='songListElementContent'>
              <div>
                <FontAwesome name='youtube-play' style={{ 'margin-right':'3px' }} />
                {youtubeLink}
              </div>
              <div>
                {customInstrument}
              </div>
              <div>
                <FontAwesome name='user' style={{ 'margin-right':'3px' }} />
                {song.priority ? <FontAwesome name='star' style={{ 'margin-right':'3px' }} /> : ''}
                {song.user.username}
              </div>
              {adminButtonPlay}
              {adminButtonDelete}
            </div>
          </div>
        );
      }, this);
    }

    return (
      <div>
        {list}
      </div>);
  }
}
