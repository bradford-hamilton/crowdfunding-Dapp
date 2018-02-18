import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      requestCount: 0,
      requests: [],
      contributorsCount: 0,
    };
  }

  async componentDidMount() {
    const address = this.props.url.query.address;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const contributorsCount = await campaign.methods.contributorsCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((el, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    this.setState({
      address,
      requests,
      requestCount,
      contributorsCount,
    });
  }

  renderRows() {
    return this.state.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.state.address}
          contributorsCount={this.state.contributorsCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.state.address}/requests/new`}>
          <a>
            <Button
              primary
              floated="right"
              style={{ marginBottom: '10px' }}
            >
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.state.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
