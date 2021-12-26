import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import CandidatesList from "./Candidates/CandidatesList";
import VotersMainList from "./Voters/VotersMainList";
import ElectionTimer from "./Election/ElectionTimer";
import Results from "./Results/Results";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReferendumResults from "./Results/ReferendumResults";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../config";

const Main = () => {
  const [timeLeftSeconds] = useState(localStorage.getItem("timeLeft"));
  const [loading] = useState(() => (timeLeftSeconds > 0 ? false : true));
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState(0);
  const [proposals, setProposals] = useState(0);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const proposalLength = await election.methods.proposalCount().call();
      const candidateLength = await election.methods.candidateCount().call();
      setCandidates(candidateLength);
      setProposals(proposalLength);
      for (let i = 0; i <= proposalLength - 1; i++) {
        const title = await election.methods.getProposalTitle(i).call();
        setTitle(title);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main">
      <Container fluid>
        <Row>
          <Col xs={12} md={6}>
            <Card className="text-center mt-3">
              <Card.Header>Voters</Card.Header>
              <Card.Body>
                <Card.Text>
                  <VotersMainList />
                </Card.Text>
              </Card.Body>
              <Card.Footer as={Link} to="/voters" className="text-info">
                More
              </Card.Footer>
            </Card>
            <Card className="text-center mt-3">
              <Card.Header>Referendum Results</Card.Header>
              <Card.Body>
                <Card.Text>
                  {proposals > 0 ? (
                    <div>
                      <h3>{title}</h3>
                      <ReferendumResults />
                    </div>
                  ) : (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Card.Text>
              </Card.Body>
              <Card.Footer as={Link} to="/results" className="text-info">
                More
              </Card.Footer>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="text-center mt-3">
              <Card.Header>Candidates</Card.Header>
              <Card.Body>
                <Card.Text>
                  <CandidatesList />
                </Card.Text>
              </Card.Body>
              <Card.Footer as={Link} to="/candidates" className="text-info">
                More
              </Card.Footer>
            </Card>
            <Card className="text-center mt-3">
              <Card.Header>Election</Card.Header>
              <Card.Body>
                <Card.Text>
                  {!loading ? (
                    <div className="timerMain">
                      <ElectionTimer />
                    </div>
                  ) : (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Card.Text>
              </Card.Body>
              <Card.Footer as={Link} to="/election" className="text-info">
                More
              </Card.Footer>
            </Card>
            <Card className="text-center mt-3">
              <Card.Header>Election Results</Card.Header>
              <Card.Body>
                <Card.Text>
                  {candidates > 0 ? (
                    <Results />
                  ) : (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Card.Text>
              </Card.Body>
              <Card.Footer as={Link} to="/results" className="text-info">
                More
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;
