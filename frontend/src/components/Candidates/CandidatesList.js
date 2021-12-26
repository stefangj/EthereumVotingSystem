import React from "react";
import { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../../config";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [show, setShow] = useState(false);
  const [link, setLink] = useState();

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  const handleClick = (link) => {
    setShow(true);
    setLink(link);
  };
  const handleClose = () => setShow(false);

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
            candidateID: i + 1,
            candidateName: candidateName,
            candidateSlogan: candidateSlogan,
            candidateParty: candidateParty,
            candidateVotes: candidateVotes,
            candidateImage: candidateImage,
            candidatePdf: candidatePdf,
          },
        ]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Table responsive striped bordered hover size="sm" variant="dark">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Candidate Bio</th>
            <th>Candidate Image</th>
            <th>Name and Surname</th>
            <th>Slogan</th>
            <th>Party</th>
            <th>Votes</th>
          </tr>
          {candidates.map((candidate) => (
            <tr key={candidate.candidateID}>
              <td>{candidate.candidateID}</td>
              <td>
                <Button
                  variant="outline-light"
                  onClick={() => handleClick(candidate.candidatePdf)}
                >
                  Open PDF
                </Button>
              </td>
              <td style={{ width: 20 + "%" }}>
                <img
                  className="candidateImageTable"
                  alt={candidate.candidateName}
                  src={candidate.candidateImage}
                />
              </td>
              <td>{candidate.candidateName}</td>
              <td>{candidate.candidateSlogan}</td>
              <td>{candidate.candidateParty}</td>
              <td>{candidate.candidateVotes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <embed src={link} frameborder="0" width="100%" height="700px" />
      </Modal>
    </div>
  );
};

export default CandidateList;
