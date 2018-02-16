import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';
import { Link } from '../routes';

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
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                content="Create a Campaign"
                icon="add circle"
                primary
                floated="right"
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
