import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";
import ElectionTimer from "../Election/ElectionTimer";

const ReferendumVoting = () => {
  const [referendumTitle, setReferendumTitle] = useState("");
  const [timeLeftSeconds] = useState(localStorage.getItem("timeLeft"));
  const [loading] = useState(() => (timeLeftSeconds > 0 ? false : true));
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);
  const [nameAndSurname, setNameAndSurname] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voterImage, setVoterImage] = useState("");
  const [voterLocation, setVoterLocation] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voterStatus, setVoterStatus] = useState("");
  const [voterReferendumStatus, setVoterReferendumStatus] = useState("");

  const voteFor = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();
    await election.methods.voteProposal(1).send({ from: account[0] });
  };

  const voteAgainst = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();
    await election.methods.voteProposal(2).send({ from: account[0] });
  };

  useEffect(() => {
    (async function () {
      const proposalLength = await election.methods.proposalCount().call();
      for (let i = 0; i < proposalLength; i++) {
        setReferendumTitle(await election.methods.getProposalTitle(i).call());
      }
      const account = await web3.eth.getAccounts();

      setNameAndSurname(
        await election.methods
          .getVoterNameAndSurnameByAddress(account[0])
          .call()
      );
      setVoterImage(
        await election.methods.getVoterImageByAddress(account[0]).call()
      );
      setVoterAddress(
        await election.methods.getVoterAddressByAddress(account[0]).call()
      );
      setVoterAge(
        2021 - (await election.methods.getVoterAgeByAddress(account[0]).call())
      );
      setVoterLocation(
        await election.methods.getVoterLocationByAddress(account[0]).call()
      );
      setVoterStatus(
        await election.methods.getVoterVoteStatusByAddress(account[0]).call()
      );
      setVoterReferendumStatus(
        await election.methods
          .getVoterVoteReferendumStatusByAddress(account[0])
          .call()
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="referendumVotingPage">
      <Container>
        <Row>
          <Col md={8}>
            <h1>Referendum</h1>
            <div className="referendumStyle">
              <Form className="votingForm">
                <div className="referendumLabel">{referendumTitle}</div>
                <br />
                <div className="referendumButtons">
                  <Button
                    size="lg"
                    variant="outline-success"
                    className="m-3"
                    onClick={voteFor}
                  >
                    For
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-danger"
                    className="m-3"
                    onClick={voteAgainst}
                  >
                    Against
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col md={4} className="h-25">
            <div className="voterDetails sticky-md-top">
              <img src={voterImage} className="imgAccount" alt="account" />
              <div className="voterDetailsDiv">{voterAddress}</div>
              <div className="voterDetailsDiv">{nameAndSurname}</div>
              <div className="voterDetailsDiv">{voterLocation}</div>
              <div className="voterDetailsDiv">{voterAge} years old</div>
              <div className="voterDetailsDiv">
                Voted: {voterStatus.toString()}
              </div>
              <div className="voterDetailsDiv">
                Referendum Voted: {voterReferendumStatus.toString()}
              </div>
            </div>
            <Row className="mt-4 text-center">
              <div className="votingTimer">
                {!loading ? (
                  <div className="timerMain">
                    <ElectionTimer />
                  </div>
                ) : (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReferendumVoting;
