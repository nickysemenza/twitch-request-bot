import React, { Component } from 'react';
import {Table} from 'react-bootstrap';

export default class SongQueue extends Component {

  render() {

    var tbody;
    if(this.props.queue)
      tbody = this.props.queue.map(function(song){
        return (<tr key={song.id}>
          <td>{song.id}</td>
          <td>{song.title}</td>
          <td>{song.youtube_id}</td>
          <td>{song.priority}</td>
          <td>{song.status}</td>
          <td>{song.user.username}</td>
          <td>
            {song.status==0 ? <button className="button-primary-wide" onClick={() => this.props.play(song.id)}>play now</button> : ''}
          </td>
        </tr>)
      },this);

    return(<Table bordered condensed>
      <thead>
      <tr>
        <th>id</th>
        <th>Song</th>
        <th>ytid</th>
        <th>priority</th>
        <th>status</th>
        <th>requested by</th>
        <th>play now</th>
      </tr>
      </thead>
      <tbody>
      {tbody}
      </tbody>
    </Table>);
  }
}
