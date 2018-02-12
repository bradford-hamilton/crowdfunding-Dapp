const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  factory.setProvider(provider);

  await factory.methods.createCampaign('100')
    .send({ from: accounts[0], gas: '1000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress,
  );

  campaign.setProvider(provider);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks the contract creator as the campaign owner', async () => {
    const owner = await campaign.methods.owner().call();
    assert.equal(accounts[0], owner);
  });

  it('allows users to contribute money and marks them as contributors', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    const isContributor = await campaign.methods.contributors(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[1],
      })
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows an owner to make a payment request', async () => {
    await campaign.methods
      .createRequest('buy all the things', '100', accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'buy all the things');
  });

  it('processes requests and transfers money appropriately', async () => {
    await campaign.methods.contribute()
      .send({
        from: accounts[1],
        value: web3.utils.toWei('10', 'ether'),
      });

    await campaign.methods
      .createRequest('to buy dogs', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0)
      .send({ from: accounts[1], gas: '1000000' });

    await campaign.methods.finalizeRequest(0)
      .send({ from: accounts[0], gas: '1000000' });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 94);
  });
});
