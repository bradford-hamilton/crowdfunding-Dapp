pragma solidity ^0.4.17;

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint _minimumContribution) public {
    address newCampaign = new Campaign(_minimumContribution, msg.sender);
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    uint approvalCount;
    mapping(address => bool) approvals;
  }

  Request[] public requests;
  address public owner;
  uint public minimumContribution;
  mapping(address => bool) public contributors;
  uint public contributorsCount;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Campaign(uint _minimumContribution, address _campaignCreator) public {
    owner = _campaignCreator;
    minimumContribution = _minimumContribution;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);

    contributors[msg.sender] = true;
    contributorsCount++;
  }

  function createRequest(
    string _description,
    uint _value,
    address _recipient
  )
    public
    onlyOwner
  {
    Request memory newRequest = Request({
      description: _description,
      value: _value,
      recipient: _recipient,
      complete: false,
      approvalCount: 0
    });

    requests.push(newRequest);
  }

  function approveRequest(uint _requestIndex) public {
    Request storage request = requests[_requestIndex];

    require(contributors[msg.sender]);
    require(!request.approvals[msg.sender]);

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }

  function finalizeRequest(uint _requestIndex) public onlyOwner {
    Request storage request = requests[_requestIndex];

    require(request.approvalCount > (contributorsCount / 2));
    require(!request.complete);

    request.recipient.transfer(request.value);
    request.complete = true;
  }

  function getSummary() public view returns (
    uint, uint, uint, uint, address
  ) {
    return (
      minimumContribution,
      this.balance,
      requests.length,
      contributorsCount,
      owner
    );
  }

  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
}
