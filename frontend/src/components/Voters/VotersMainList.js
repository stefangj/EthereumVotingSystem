import React from "react";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../../config";

const VotersList = () => {
  const [voters, setVoters] = useState([]);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const voterLength = await election.methods.getVoterCount().call();

      for (let i = 0; i <= voterLength - 1; i++) {
        const voterAddress = await election.methods.getVoterAddress(i).call();
        const voterNameAndSurname = await election.methods
          .getVoterNameAndSurname(i)
          .call();
        const voterYear = await election.methods.getVoterAge(i).call();
        const voterAge = 2021 - parseInt(voterYear);
        const voterPrivateKey = await election.methods
          .getVoterPrivateKey(i)
          .call();
        const voterVoteStatus = await election.methods
          .getVoterVoteStatusByAddress(voterAddress)
          .call();
        const voterVoteReferendumStatus = await election.methods
          .getVoterVoteReferendumStatusByAddress(voterAddress)
          .call();
        setVoters((voters) => [
          ...voters,
          {
            voterID: i,
            voterAddress: voterAddress,
            voterPrivateKey: voterPrivateKey,
            voterNameAndSurname: voterNameAndSurname,
            voterAge: voterAge,
            voterVoteStatus: voterVoteStatus,
            voterVoteReferendumStatus: voterVoteReferendumStatus,
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
            <th>Address</th>
            <th>Name and Surname</th>
            <th>Age</th>
            <th>Election Voted</th>
            <th>Referendum Voted</th>
          </tr>

          {voters.map((voter) => (
            <tr key={voter.voterID}>
              <td>{voter.voterAddress}</td>
              <td>{voter.voterNameAndSurname}</td>
              <td>{voter.voterAge}</td>
              <td>{voter.voterVoteStatus.toString()}</td>
              <td>{voter.voterVoteReferendumStatus.toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VotersList;
