import React, { Component } from 'react';
import {Table} from 'react-bootstrap';

export default class SongQueue extends Component {

  render() {

    var tbody;
    if(this.props.queue)
      tbody = this.props.queue.map(function(song){
        return (<tr key={song.id}>
          <td>{song.title}</td>
          <td>{song.youtube_id}</td>
          <td>{song.priority}</td>
          <td>{song.status}</td>
        </tr>)
      });

    return(<Table bordered condensed>
      <thead>
      <tr>
        <th>Song</th>
        <th>ytid</th>
        <th>priority</th>
        <th>status</th>
      </tr>
      </thead>
      <tbody>
      {tbody}
      </tbody>
    </Table>);
  }
}
