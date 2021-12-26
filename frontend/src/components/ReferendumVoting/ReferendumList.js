import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";

const ReferendumList = () => {
  const [title, setTitle] = useState("");
  const [proposalPos, setProposalPos] = useState();
  const [proposalNeg, setProposalNeg] = useState();

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const proposalLength = await election.methods.proposalCount().call();
      for (let i = 0; i <= proposalLength - 1; i++) {
        setTitle(await election.methods.getProposalTitle(i).call());
        setProposalPos(await election.methods.getProposalPos(i).call());
        setProposalNeg(await election.methods.getProposalNeg(i).call());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Table
        className="w-100"
        responsive
        striped
        bordered
        hover
        size="sm"
        variant="dark"
      >
        <tbody>
          <tr>
            <th>Title</th>
            <th>For</th>
            <th>Against</th>
          </tr>
          <tr>
            <th>{title}</th>
            <th>{proposalPos}</th>
            <th>{proposalNeg}</th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ReferendumList;
