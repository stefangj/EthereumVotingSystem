import React from "react";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import AddCandidate from "./AddCandidate";
import CandidateList from "./CandidatesList";

const CandidatesPage = () => {
  const [view, setView] = useState(1);

  return (
    <div className="candidatesList">
      <Container fluid>
        <Button
          variant="outline-secondary"
          onClick={() => setView(1)}
          className="m-3"
        >
          Candidates List
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => setView(2)}
          className="m-3"
        >
          Add Candidates
        </Button>
        <div className="content">
          {view === 1 ? <CandidateList /> : ""}
          {view === 2 ? <AddCandidate /> : ""}
        </div>
      </Container>
    </div>
  );
};

export default CandidatesPage;
