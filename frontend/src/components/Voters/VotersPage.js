import React, { useState } from "react";
import VotersList from "./VotersList";
import AddVoters from "./AddVoters";
import { Button, Container } from "react-bootstrap";

const VotersPage = () => {
  const [view, setView] = useState(1);

  return (
    <div className="votersList">
      <Container fluid>
        <Button
          variant="outline-secondary"
          onClick={() => setView(1)}
          className="m-3"
        >
          Voters List
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => setView(2)}
          className="m-3"
        >
          Add Voters
        </Button>
        <div className="content">
          {view === 1 ? <VotersList /> : ""}
          {view === 2 ? <AddVoters /> : ""}
        </div>
      </Container>
    </div>
  );
};

export default VotersPage;
