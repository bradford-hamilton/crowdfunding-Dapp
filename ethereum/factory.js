import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const contractInstance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xf0A577BB46183cEE9a0f0a6591b661CE809D6F03',
);

export default contractInstance;
