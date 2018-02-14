import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const contractInstance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x4b19D3c0d5651aC9483AA8aD2448a6C13ab2B3d4',
);

export default contractInstance;
