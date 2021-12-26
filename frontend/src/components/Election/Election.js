import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import ElectionTimer from "./ElectionTimer";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";

const Election = () => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeLeftSeconds] = useState(localStorage.getItem("timeLeft"));
  const [loading, setLoading] = useState(() =>
    timeLeftSeconds > 0 ? false : true
  );

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);
  let startDateObj = new Date(startDate);
  let endDateObj = new Date(endDate);

  let dateStart =
    new Date(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate(),
      startTime.split(":", 2)[0],
      startTime.split(":", 2)[1],
      0
    ) / 1000.0;

  let dateEnd =
    new Date(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate(),
      endTime.split(":", 2)[0],
      endTime.split(":", 2)[1],
      0
    ) / 1000.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const account = await web3.eth.getAccounts();

    localStorage.setItem("startElection", dateStart);
    localStorage.setItem("endElection", dateEnd);
    setLoading(false);
    await election.methods
      .setStartEndTime(dateStart, dateEnd)
      .send({ from: account[0] });
    window.location.reload(true);
  };

  return (
    <div className="electionForm">
      <Container className="m-4">
        <h1>Fill the form with Start Time and End Time</h1>
        <br />
        <Row>
          <Col md={6} sm={12}>
            <Form className="w-75 formElection" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select start date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Form.Control
                  type="time"
                  placeholder="Select start time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select end date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Form.Control
                  type="time"
                  placeholder="Select end time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="outline-success"
                className="float-end mb-3"
                type="submit"
              >
                Start Election
              </Button>
            </Form>
          </Col>
          <Col md={6} sm={12}>
            <div className="submitInfo">
              {loading ? (
                <div className="loader">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <div>
                  <div className="timerElection">
                    <ElectionTimer />
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Election;
