import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

class CampaignShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minimumContribution: '',
      balance: '',
      requestsCount: '',
      contributorsCount: '',
      owner: '',
      address: '',
    }
  }

  async componentDidMount() {
    const campaign = Campaign(this.props.url.query.address);
    const summary = await campaign.methods.getSummary().call();

    this.setState({
      address: this.props.url.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      contributorsCount: summary[3],
      owner: summary[4],
    });
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      contributorsCount,
      owner,
    } = this.state;

    const items = [
      {
        header: owner,
        meta: 'Address of the owner of this campaign.',
        description: 'The owner created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum contribution in wei.',
        description: 'You must contribute at least this amount in wei to become a contributor.',
      },
      {
        header: requestsCount,
        meta: 'Number of requests.',
        description: 'A request tries to withdraw money from the contract.',
      },
      {
        header: contributorsCount,
        meta: 'Number of contributors.',
        description: 'Number of people who have already contributed to this contract.',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign balance in Ether.',
        description: 'The balance of the amount of ether this campaign has left to spend.',
      },
    ];

    return <Card.Group items={items}/>
  }

  render() {
    return (
      <Layout>
        <h3>Campaign show</h3>
        <Grid>
          <Grid.Column width={10}>
            {this.renderCards()}
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column width={6}>
            <ContributeForm address={this.state.address} />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
