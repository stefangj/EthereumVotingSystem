import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";
import ReferendumList from "./ReferendumList";

const Referendum = () => {
  const [title, setTitle] = useState("");

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();

    await election.methods.addProposal(title).send({ from: account[0] });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="referendum">
      <Container className="m-4">
        <Row>
          <Col md={6} sm={12}>
            <Form className="w-75 formReferendum" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Referendum Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Referendum Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="outline-success"
                className="float-end mb-3"
                type="submit"
              >
                Add Referendum Title
              </Button>
            </Form>
          </Col>
          <Col>
            <ReferendumList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Referendum;
