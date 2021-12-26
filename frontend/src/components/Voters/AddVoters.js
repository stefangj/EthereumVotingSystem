import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { ElectionAbi, ElectionAddress } from "../../config";
import Web3 from "web3";
import Wallet from "ethereumjs-wallet";

const AddVoters = () => {
  const [nameAndSurname, setNameAndSurname] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voterPrivateKey, setVoterPrivateKey] = useState("");
  const [loading, setLoading] = useState(true);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = await web3.eth.getAccounts();
    let addressData = Wallet.generate();
    setVoterAddress(addressData.getAddressString());
    setVoterPrivateKey(addressData.getPrivateKeyString());
    await election.methods
      .insertVoter(
        addressData.getAddressString(),
        addressData.getPrivateKeyString(),
        image,
        nameAndSurname,
        location,
        age
      )
      .send({ from: account[0] });

    web3.eth.sendTransaction({
      to: addressData.getAddressString(),
      from: account[0],
      value: web3.utils.toWei("0.5", "ether"),
    });

    setLoading(false);
    setTimeout(() => {
      setLoading(true);
      setNameAndSurname("");
      setImage("");
      setLocation("");
      setAge("");
    }, 5000);
  };

  return (
    <div className="addCandidateForm">
      <Container className="m-4">
        <Row>
          <Col md={6} sm={12}>
            <Form className="w-75 formVoter" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Voter Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  required
                  value={image}
                  onInput={(e) => setImage(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Voter Name And Surname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name and surname"
                  required
                  value={nameAndSurname}
                  onInput={(e) => setNameAndSurname(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Voter Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  required
                  value={location}
                  onInput={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Voter Year of Birth</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Year of Birth"
                  required
                  value={age}
                  onInput={(e) => setAge(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="outline-success"
                className="float-end mb-3"
                type="submit"
              >
                Add Voter
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
                  <h2>Last successfully added voter</h2>
                  <h3>Voter name:</h3>
                  <div>{nameAndSurname}</div>
                  <h3>Voter age:</h3>
                  <div>{2021 - age}</div>
                  <h3>Voter location:</h3>
                  <div>{location}</div>
                  <h3>Voter address:</h3>
                  <div>{voterAddress}</div>
                  <h3>Voter private key:</h3>
                  <div>{voterPrivateKey}</div>
                  <div className="addNew">
                    You can add new voter in 5 seconds
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

export default AddVoters;
