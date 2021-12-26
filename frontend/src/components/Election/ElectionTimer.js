import { Spinner } from "react-bootstrap";
import React, { useState } from "react";

const ElectionTimer = () => {
  const [start] = useState(localStorage.getItem("startElection"));
  const [end] = useState(localStorage.getItem("endElection"));
  const [timeLeft, setTimeLeft] = useState("");
  const [timeLeftSeconds] = useState(localStorage.getItem("timeLeft"));
  const [loading, setLoading] = useState(() =>
    timeLeftSeconds > 0 ? false : true
  );

  const electionStarted = () => {
    const d = new Date(start * 1000);
    const strDate = d.toLocaleString("en-GB", { hour12: false });
    return strDate;
  };

  const electionEnded = () => {
    const d = new Date(end * 1000);
    const strDate = d.toLocaleString("en-GB", { hour12: false });
    return strDate;
  };

  const isElectionStarted = () => {
    let timeNow = Math.floor(new Date().getTime() / 1000.0);
    if (timeNow >= start && timeNow <= end) {
      return true;
    }
    return false;
  };

  let timer = setInterval(() => {
    let timeNow = Math.floor(new Date().getTime() / 1000.0);
    let timeLeft = end - timeNow;
    let toHHMMSS = (timeLeft) => {
      var sec_num = parseInt(timeLeft, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [hours, minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
    };
    if (timeLeft < 0) {
      localStorage.setItem("timeLeft", 0);
      clearInterval(timer);
      setLoading(true);
    } else {
      localStorage.setItem("timeLeft", timeLeft);
    }
    setTimeLeft(toHHMMSS(timeLeft));
  }, 1000);

  return (
    <div>
      {!loading ? (
        <div>
          Election Start: {electionStarted()}
          <br />
          Election End: {electionEnded()}
          <br />
          {!isElectionStarted() ? (
            <div>Тhe elections have not started yet!</div>
          ) : (
            <div>Time remaining: {timeLeft}</div>
          )}
        </div>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </div>
  );
};

export default ElectionTimer;
