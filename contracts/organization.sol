contract Organization {
  // This contract will keep track of the entire organizations state
  // This includes voters and their delegations, polls and domains

  // Organization Meta Information
  struct Org {
    bytes32 name;
    string description;
    bytes32[] domains;
    uint numVoters;
  }

  struct Voter {
    bytes32 name;
    address ethaddress;

  }

  struct Delegation {
    address delegate;
    address delegator;

  }

  Org public org;
  Voter[] v;

}
