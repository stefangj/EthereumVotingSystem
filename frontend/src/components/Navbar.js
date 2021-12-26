import React, { useState, useEffect } from "react";
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faUsers,
  faVoteYea,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Web3 from "web3";

const NavbarComponent = () => {
  const web3 = new Web3(Web3.givenProvider || "http:localhost:7545");
  const [account, setAccount] = useState();

  useEffect(() => {
    (async function () {
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navbar bg="dark" expand={false} variant="dark" collapseOnSelect={true}>
      <Container fluid>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Brand className="m-auto" as={Link} to="/">
          Ethereum Blockchain Voting
        </Navbar.Brand>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          className="bg-dark text-white"
        >
          <Offcanvas.Header>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Dashboard
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {account === "0x5Fcb3aa65034746Ea3872C9790d0E291a0B49cCD" ? (
                <>
                  <Nav.Link as={Link} eventKey="1" to="/">
                    {" "}
                    <FontAwesomeIcon icon={faHome} /> Home
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/candidates">
                    {" "}
                    <FontAwesomeIcon icon={faUser} /> Candidates
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/voters">
                    {" "}
                    <FontAwesomeIcon icon={faUsers} /> Voters
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/referendum">
                    {" "}
                    <FontAwesomeIcon icon={faVoteYea} /> Referendum
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/election">
                    {" "}
                    <FontAwesomeIcon icon={faVoteYea} /> Election
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/results">
                    {" "}
                    <FontAwesomeIcon icon={faChartLine} /> Results
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} eventKey="1" to="/results">
                    {" "}
                    <FontAwesomeIcon icon={faChartLine} /> Results
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/voting">
                    {" "}
                    <FontAwesomeIcon icon={faVoteYea} /> Voting
                  </Nav.Link>
                  <Nav.Link as={Link} eventKey="1" to="/referendumVoting">
                    {" "}
                    <FontAwesomeIcon icon={faVoteYea} /> Referendum Voting
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
