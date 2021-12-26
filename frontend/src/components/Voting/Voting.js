import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";
import { Spinner } from "react-bootstrap";
import ElectionTimer from "../Election/ElectionTimer";

const Voting = () => {
  const [timeLeftSeconds] = useState(localStorage.getItem("timeLeft"));
  const [loading] = useState(() => (timeLeftSeconds > 0 ? false : true));
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);
  const [candidates, setCandidates] = useState([]);
  const [candidateClicked, setCandidateClicked] = useState("");
  const [nameAndSurname, setNameAndSurname] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voterImage, setVoterImage] = useState("");
  const [voterLocation, setVoterLocation] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voterStatus, setVoterStatus] = useState("");
  const [voterReferendumStatus, setVoterReferendumStatus] = useState("");
  const [show, setShow] = useState(false);
  const [link, setLink] = useState();

  const handleClick = (link) => {
    setShow(true);
    setLink(link);
  };
  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();
    await election.methods.vote(candidateClicked).send({ from: account[0] });
  };

  useEffect(() => {
    (async function () {
      const candidateLength = await election.methods.candidateCount().call();

      for (let i = 0; i <= candidateLength - 1; i++) {
        const candidateName = await election.methods.getCandidate(i).call();
        const candidateSlogan = await election.methods.getSlogan(i).call();
        const candidateParty = await election.methods.getParty(i).call();
        const candidateVotes = await election.methods.getVotes(i).call();
        const candidateImage = await election.methods.getImage(i).call();
        const candidatePdf = await election.methods.getPdfLink(i).call();
        setCandidates((candidates) => [
          ...candidates,
          {
            candidateID: i,
            candidateName: candidateName,
            candidateSlogan: candidateSlogan,
            candidateParty: candidateParty,
            candidateVotes: candidateVotes,
            candidateImage: candidateImage,
            candidatePdf: candidatePdf,
          },
        ]);
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
    <div className="votingPage">
      <Container>
        <Row>
          <Col md={8}>
            <h1>Choose which candidate you want to vote for</h1>
            <Form className="votingForm" onSubmit={handleSubmit}>
              {candidates.map((candidate) => (
                <Row>
                  <div className="candidateLabel">
                    <div className="candidateStyle">
                      <Form.Check
                        type="radio"
                        name="election"
                        className="radioButton"
                        onChange={(e) =>
                          setCandidateClicked(candidate.candidateID)
                        }
                        key={candidate.candidateID}
                      />
                      <span className="candidateVoting">
                        <img
                          className="candidateImage"
                          alt={candidate.candidateName}
                          src={candidate.candidateImage}
                        />
                      </span>
                      <span className="candidateVoting">
                        {candidate.candidateName}
                      </span>
                      <span className="candidateVoting">
                        {candidate.candidateSlogan}
                      </span>
                      <span className="candidateVoting">
                        {candidate.candidateParty}
                      </span>
                      <span classname="candidateVoting">
                        <Button
                          variant="outline-dark"
                          onClick={() => handleClick(candidate.candidatePdf)}
                        >
                          Open PDF
                        </Button>
                      </span>
                    </div>
                  </div>
                </Row>
              ))}
              <div className="voteButton">
                <Button size="lg" type="submit">
                  Vote
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={4} className="h-25">
            <div className="voterDetails sticky-md-top">
              <img src={voterImage} className="imgAccount" alt="account" />
              <div className="voterDetailsDiv">{voterAddress}</div>
              <div className="voterDetailsDiv">{nameAndSurname}</div>
              <div className="voterDetailsDiv">{voterLocation}</div>
              <div className="voterDetailsDiv">{voterAge} years old</div>
              <div className="voterDetailsDiv">
                Election Voted: {voterStatus.toString()}
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
      <Modal show={show} onHide={handleClose}>
        <embed src={link} frameborder="0" width="100%" height="700px" />
      </Modal>
    </div>
  );
};

export default Voting;
