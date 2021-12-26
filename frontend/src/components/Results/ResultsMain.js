import React, { useState, useEffect } from "react";
import Results from "./Results";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../../config";
import { Col, Row } from "react-bootstrap";
import ElectionVoterStructure from "./ElectionVoterStructure";
import ReferendumVoterStructure from "./ReferendumVoterStructure";
import ReferendumResults from "./ReferendumResults";

const ResultsMain = () => {
  const [votersCount, setVotersCount] = useState(0);
  const [votersVoted, setVotersVoted] = useState(0);
  const [voterVotedReferendum, setVotersVotedReferendum] = useState(0);
  const [title, setTitle] = useState("");
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const voterLength = await election.methods.getVoterCount().call();
      const proposalLength = await election.methods.proposalCount().call();

      setVotersCount(voterLength);

      let voterTrue = 0;
      let voterReferendumTrue = 0;
      for (let i = 0; i <= proposalLength - 1; i++) {
        const title = await election.methods.getProposalTitle(i).call();
        setTitle(title);
      }
      for (let i = 0; i <= voterLength - 1; i++) {
        const voterVoteStatus = await election.methods
          .getVoterVoteStatus(i)
          .call();
        const voterVoteStatusReferendum = await election.methods
          .getVoterVoteReferendumStatus(i)
          .call();
        if (voterVoteStatus.toString() === "true") {
          voterTrue++;
          setVotersVoted(voterTrue);
        }
        if (voterVoteStatusReferendum.toString() === "true") {
          voterReferendumTrue++;
          setVotersVotedReferendum(voterReferendumTrue);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="resultsPage">
      <h1>Election Results</h1>
      <h3>
        Voters voted: {votersVoted}/{votersCount}
      </h3>
      <br />
      <br />
      <Row>
        <Col xs={12} md={6}>
          <Results />
        </Col>
        <Col xs={12} md={6}>
          <ElectionVoterStructure />
        </Col>
      </Row>
      <br />
      <br />
      <hr />
      <h1>Referendum Results</h1>
      <h3>
        Voters voted: {voterVotedReferendum}/{votersCount}
      </h3>
      <h4>Referendum Question: {title}</h4>
      <br />
      <br />
      <Row>
        <Col xs={12} md={6}>
          <ReferendumResults />
        </Col>
        <Col xs={12} md={6}>
          <ReferendumVoterStructure />
        </Col>
      </Row>
    </div>
  );
};

export default ResultsMain;
