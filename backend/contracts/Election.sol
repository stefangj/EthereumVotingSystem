// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Election {
    address admin;
    uint256 public candidateCount;
    uint256 public voterCount;
    uint256 public proposalCount;
    uint256 electionStart;
    uint256 electionEnd;

    struct Candidate {
        uint256 candidateID;
        string image;
        string pdfLink;
        string candidateNameAndSurname;
        string slogan;
        string party;
        uint256 voteCount;
    }

    struct Proposal {
        uint256 proposalID;
        string title;
        uint256 voteCountPos;
        uint256 voteCountNeg;
    }

    struct Voter {
        uint256 voterID;
        address voterAddress;
        string voterPrivateKey;
        string voterImage;
        string voterNameAndSurname;
        string voterLocation;
        uint256 voterAge;
        bool voted;
        bool proposalVoted;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    mapping(uint256 => Candidate) candidates;
    mapping(uint256 => Proposal) proposals;
    mapping(address => Voter) voters;
    Voter[] voterRegister;

    event CreatedProposalEvent();
    event CreatedVoteEvent();

    constructor() public {
        //admin = PUT ADMIN ADDRESS FROM GANACHE;
        candidateCount = 0;
        voterCount = 0;
        proposalCount = 0;
    }

    function insertVoter(
        address voterAddress,
        string memory voterPrivateKey,
        string memory voterImage,
        string memory voterNameAndSurname,
        string memory voterLocation,
        uint256 voterAge
    ) public payable onlyAdmin {
        Voter memory newVoter = Voter({
            voterID: voterCount,
            voterAddress: voterAddress,
            voterPrivateKey: voterPrivateKey,
            voterImage: voterImage,
            voterNameAndSurname: voterNameAndSurname,
            voterLocation: voterLocation,
            voterAge: voterAge,
            voted: false,
            proposalVoted: false
        });

        voterRegister.push(newVoter);
        voters[voterAddress] = newVoter;
        voterCount++;
    }

    function getVoterIndexByAddress(address voterAddress)
        public
        view
        returns (uint256)
    {
        return voters[voterAddress].voterID;
    }

    function getVoterNameAndSurnameByAddress(address voterAddress)
        public
        view
        returns (string memory)
    {
        return voters[voterAddress].voterNameAndSurname;
    }

    function getVoterAddressByAddress(address voterAddress)
        public
        view
        returns (address)
    {
        return voters[voterAddress].voterAddress;
    }

    function getVoterImageByAddress(address voterAddress)
        public
        view
        returns (string memory)
    {
        return voters[voterAddress].voterImage;
    }

    function getVoterLocationByAddress(address voterAddress)
        public
        view
        returns (string memory)
    {
        return voters[voterAddress].voterLocation;
    }

    function getVoterAgeByAddress(address voterAddress)
        public
        view
        returns (uint256)
    {
        return voters[voterAddress].voterAge;
    }

    function getVoterVoteStatusByAddress(address voterAddress)
        public
        view
        onlyAdmin
        returns (bool)
    {
        return voters[voterAddress].voted;
    }

    function getVoterVoteReferendumStatusByAddress(address voterAddress)
        public
        view
        onlyAdmin
        returns (bool)
    {
        return voters[voterAddress].proposalVoted;
    }

    function getVoterPrivateKey(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return voterRegister[index].voterPrivateKey;
    }

    function getVoterVoteStatus(uint256 index)
        public
        view
        onlyAdmin
        returns (bool)
    {
        return voterRegister[index].voted;
    }

    function getVoterVoteReferendumStatus(uint256 index)
        public
        view
        onlyAdmin
        returns (bool)
    {
        return voterRegister[index].proposalVoted;
    }

    function getVoterAddress(uint256 index)
        public
        view
        onlyAdmin
        returns (address)
    {
        return voterRegister[index].voterAddress;
    }

    function getVoterNameAndSurname(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return voterRegister[index].voterNameAndSurname;
    }

    function getVoterImage(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return voterRegister[index].voterImage;
    }

    function getVoterLocation(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return voterRegister[index].voterLocation;
    }

    function getVoterAge(uint256 index)
        public
        view
        onlyAdmin
        returns (uint256)
    {
        return voterRegister[index].voterAge;
    }

    function getVoterCount() public view onlyAdmin returns (uint256 count) {
        return voterCount;
    }

    function addCandidate(
        string memory _image,
        string memory _pdfLink,
        string memory _nameAndSurname,
        string memory _slogan,
        string memory _party
    ) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
            candidateID: candidateCount,
            image: _image,
            pdfLink: _pdfLink,
            candidateNameAndSurname: _nameAndSurname,
            slogan: _slogan,
            party: _party,
            voteCount: 0
        });

        candidates[candidateCount] = newCandidate;
        candidateCount++;
    }

    function getImage(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return candidates[index].image;
    }

    function getPdfLink(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return candidates[index].pdfLink;
    }

    function getCandidate(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return candidates[index].candidateNameAndSurname;
    }

    function getSlogan(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return candidates[index].slogan;
    }

    function getParty(uint256 index)
        public
        view
        onlyAdmin
        returns (string memory)
    {
        return candidates[index].party;
    }

    function getVotes(uint256 index) public view onlyAdmin returns (uint256) {
        return candidates[index].voteCount;
    }

    function setStartEndTime(uint256 _start, uint256 _end) public onlyAdmin {
        electionStart = _start;
        electionEnd = _end;
    }

    function getStartTime() public view onlyAdmin returns (uint256) {
        return electionStart;
    }

    function getEndTime() public view onlyAdmin returns (uint256) {
        return electionEnd;
    }

    function addProposal(string memory title) public onlyAdmin {
        Proposal memory newProposal = Proposal({
            proposalID: proposalCount,
            title: title,
            voteCountPos: 0,
            voteCountNeg: 0
        });
        proposals[proposalCount] = newProposal;
        proposalCount++;
    }

    function getProposalTitle(uint256 index)
        public
        view
        returns (string memory)
    {
        return proposals[index].title;
    }

    function getProposalPos(uint256 index) public view returns (uint256) {
        return proposals[index].voteCountPos;
    }

    function getProposalNeg(uint256 index) public view returns (uint256) {
        return proposals[index].voteCountNeg;
    }

    function vote(uint256 candidateID) public {
        require(block.timestamp >= electionStart);
        require(block.timestamp <= electionEnd);
        require(msg.sender != admin);
        require(voters[msg.sender].voted == false);
        candidates[candidateID].voteCount++;
        voters[msg.sender].voted = true;
        voterRegister[getVoterIndexByAddress(msg.sender)].voted = true;
    }

    function voteProposal(uint256 voteValue) public {
        require(block.timestamp >= electionStart);
        require(block.timestamp <= electionEnd);
        require(msg.sender != admin);
        require(voters[msg.sender].proposalVoted == false);
        require(voteValue == 1 || voteValue == 2 || voteValue == 3);
        if (voteValue == 1) {
            proposals[0].voteCountPos += 1;
        } else if (voteValue == 2) {
            proposals[0].voteCountNeg += 1;
        }
        voters[msg.sender].proposalVoted = true;
        voterRegister[getVoterIndexByAddress(msg.sender)].proposalVoted = true;
    }
}
