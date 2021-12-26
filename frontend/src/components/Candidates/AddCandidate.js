import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";

const AddCandidate = () => {
  const [nameAndSurname, setNameAndSurname] = useState("");
  const [slogan, setSlogan] = useState("");
  const [party, setParty] = useState("");
  const [image, setImage] = useState("");
  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(true);

  const web3 = new Web3(Web3.givenProvider || "http:localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();

    await election.methods
      .addCandidate(image, pdf, nameAndSurname, slogan, party)
      .send({ from: account[0] });

    setLoading(false);
    setTimeout(() => {
      setLoading(true);
      setImage("");
      setPdf("");
      setNameAndSurname("");
      setSlogan("");
      setParty("");
    }, 5000);
  };

  return (
    <div className="addCandidateForm ">
      <Container className="m-4">
        <Row>
          <Col md={6} sm={12}>
            <Form className="w-75 formCandidate" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bio Document URL(.pdf)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Bio Document URL"
                  required
                  value={pdf}
                  onChange={(e) => setPdf(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Candidate Name and Surname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name and surname"
                  required
                  value={nameAndSurname}
                  onChange={(e) => setNameAndSurname(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Candidate Slogan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter slogan"
                  required
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Candidate Party</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter party"
                  required
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="outline-success"
                className="float-end mb-3"
                type="submit"
              >
                Add Candidate
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
                  <h2>Last successfully added candidate</h2>
                  <h3>Candidate name:</h3>
                  <div>{nameAndSurname}</div>
                  <h3>Candidate slogan</h3>
                  <div>{slogan}</div>
                  <h3>Candidate party</h3>
                  <div>{party}</div>
                  <div className="addNew">
                    You can add new candidate in 5 seconds
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

export default AddCandidate;
