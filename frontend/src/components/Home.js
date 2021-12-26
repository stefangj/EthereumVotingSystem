import React, { useState, useEffect } from "react";
import NavbarComponent from "./Navbar";
import { Route, Switch } from "react-router-dom";
import CandidatesPage from "./Candidates/CandidatesPage";
import Main from "./Main";
import Election from "./Election/Election";
import ResultsMain from "./Results/ResultsMain";
import Voting from "./Voting/Voting";
import VotersPage from "./Voters/VotersPage";
import ReferendumVoting from "./Voting/ReferendumVoting";
import Web3 from "web3";
import Referendum from "./ReferendumVoting/Referendum";

const Home = () => {
  const web3 = new Web3(Web3.givenProvider || "http:localhost:7545");
  const [account, setAccount] = useState();
  const adminAccount = "ADMIN ADDRESS FROM GANACHE";

  useEffect(() => {
    (async function () {
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavbarComponent />
      <Switch>
        <Route exact path="/">
          {account === adminAccount ? <Main /> : <Voting />}
        </Route>
        <Route path="/candidates">
          {account === adminAccount ? <CandidatesPage /> : <Voting />}
        </Route>
        <Route path="/voters">
          {account === adminAccount ? <VotersPage /> : <Voting />}
        </Route>
        <Route path="/referendum">
          {account === adminAccount ? <Referendum /> : <Voting />}
        </Route>
        <Route path="/election">
          {account === adminAccount ? <Election /> : <Voting />}
        </Route>
        <Route path="/results">
          <ResultsMain />
        </Route>
        <Route path="/voting">
          {account === adminAccount ? <Main /> : <Voting />}
        </Route>
        <Route path="/referendumVoting">
          {account === adminAccount ? <Main /> : <ReferendumVoting />}
        </Route>
      </Switch>
    </div>
  );
};

export default Home;
