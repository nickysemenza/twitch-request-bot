import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import moment from 'moment';
export default class AdminUsers extends Component {

  constructor (props) {
    super(props);
  }
  componentDidMount = () => {
    setInterval(() => {
      this.props.loadUserList();
    }, 1000);
  };

  giveCredits (user_id, amt) {
    console.log('give ' + user_id + ' ' + amt + 'points');
    this.props.giveCredits(user_id, amt);
  }

  render () {
    let content;

    if (this.props.user_list) {
      content = this.props.user_list.map(function (user) {
        return (<tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>{user.credits}</td>
          {/* <td>{user.is_subscriber}</td> */}
          <td>
            <button className='button-primary' onClick={() => this.giveCredits(user.id, 100)}>give 100</button>
            <button className='button-primary' onClick={() => this.giveCredits(user.id, 500)}>give 500</button>
          </td>
          <td>{user.minutes_watched}</td>
          <td>{user.minutes_watched_active}</td>
          <td>{moment.utc(user.last_message).fromNow()}</td>
        </tr>);
      }, this);
    }
    const tableInstance = (
      <Table bordered condensed>
        <thead>
          <tr>
            <th>#</th>
            <th>username</th>
            <th># credits</th>
            {/* <th>is_subscriber</th> */}
            <th>give credits</th>
            <th>minutes watched total </th>
            <th>active minutes watched</th>
            <th>last chat message</th>
          </tr>
        </thead>
        <tbody>
          {content}
        </tbody>
      </Table>
    );
    return (
      <div>

        <Grid>
          <Row className='show-grid'>
            <Col sm={12} md={12}>
              <button className='button-primary-wide' onClick={this.props.loadUserList}>reload user list</button>
              {tableInstance}
            </Col>
          </Row>
        </Grid>
      </div>);
  }
}
