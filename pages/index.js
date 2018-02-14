import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
  constructor(props) {
    super(props);
    this.state = { campaigns: [] };
  }

  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    this.setState({ campaigns });
  }

  renderCampaigns() {
    const items = this.state.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <div>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
          <h3>Open Campaigns</h3>
          {this.renderCampaigns()}
          <Button
            content="Create a Campaign"
            icon="add circle"
            primary
          />
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
