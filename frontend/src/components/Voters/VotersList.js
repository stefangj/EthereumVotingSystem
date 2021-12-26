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
        const voterImage = await election.methods.getVoterImage(i).call();
        const voterLocation = await election.methods.getVoterLocation(i).call();
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
            voterImage: voterImage,
            voterLocation: voterLocation,
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
            <th colSpan={2}>Keys</th>
            <th style={{ width: 10 + "%" }}>Voter Image</th>
            <th>Name and Surname</th>
            <th>Location</th>
            <th>Age</th>
            <th>Election Voted</th>
            <th>Referendum Voted</th>
          </tr>

          {voters.map((voter) => (
            <>
              <tr>
                <td>Address</td>
                <td>{voter.voterAddress}</td>
                <td rowSpan={2}>
                  <img
                    className="voterImage"
                    alt={voter.voterNameAndSurname}
                    src={voter.voterImage}
                  />
                </td>
                <td rowSpan={2}>{voter.voterNameAndSurname}</td>
                <td rowSpan={2}>{voter.voterLocation}</td>
                <td rowSpan={2}>{voter.voterAge}</td>
                <td rowSpan={2}>{voter.voterVoteStatus.toString()}</td>
                <td rowSpan={2}>
                  {voter.voterVoteReferendumStatus.toString()}
                </td>
              </tr>
              <tr>
                <td>Private Key</td>
                <td>{voter.voterPrivateKey}</td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VotersList;
