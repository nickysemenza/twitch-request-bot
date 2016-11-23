import React, { Component, PropTypes } from 'react';
import {Grid, Row, Col, Table} from 'react-bootstrap';
import PrettyJSON from './PrettyJSON';
export default class AdminUsers extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    setInterval(() => {
      this.props.loadUserList();
    }, 3000);
  };

  giveCredits(user_id, amt) {
    console.log("give "+user_id+" "+amt+"points");
    this.props.giveCredits(user_id,amt);
  }


  render() {
    let content;

    if(this.props.user_list)
    content = this.props.user_list.map(function(user){
      return(<tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.credits}</td>
        <td>{user.is_subscriber}</td>
        <td>
          <button className="button-primary" onClick={() => this.giveCredits(user.id,1)}>give 1</button>
          <button className="button-primary" onClick={() => this.giveCredits(user.id,5)}>give 5</button>
        </td>
      </tr>)
    },this);
    const tableInstance = (
      <Table bordered condensed>
        <thead>
        <tr>
          <th>#</th>
          <th>username</th>
          <th># credits</th>
          <th>is_subscriber</th>
          <th>give credits</th>
        </tr>
        </thead>
        <tbody>
        {content}
        </tbody>
      </Table>
    );
    return(
      <div>

        <Grid>
          <Row className="show-grid">
            <Col sm={6} md={6}>
              {/*<button className="button-primary-wide" onClick={this.props.loadUserList}>[debugreload] user list</button>*/}
              {tableInstance}
            </Col>
            <Col sm={6} md={6}>
              <PrettyJSON data={this.props.user_list}/>
            </Col>
          </Row>
        </Grid>
    </div>);
  }
}
