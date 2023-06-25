import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography } from "@mui/material";

const App = () => {
  const [balance, setBalance] = useState(10);
  const [bets, setBets] = useState([0, 0, 0, 0, 0, 0]);
  const [timer, setTimer] = useState(10);
  const [active, setActive] = useState(true);
  const [winner, setWinner] = useState(null);
  const [wonAmount, setWonAmount] = useState(null);
  const [lostAmount, setLostAmount] = useState(null);

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const handleBet = (position) => {
    let sum = bets.reduce((total, item) => total + item);
    if (sum >= balance) {
      alert("Your Balance is not sufficient");
      return 0;
    } else if (active && balance >= bets[position] + 1) {
      setBets((prevBets) => {
        const updatedBets = [...prevBets];
        updatedBets[position] += 1;
        return updatedBets;
      });
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const tg = setTimeout(() => setTimer((prevTimer) => prevTimer - 1), 1000);
      return () => clearTimeout(tg);
    } else if (timer === 0) {
      setActive(false);
      setTimeout(() => {
        const winningPosition = rollDice() - 1;
        setWinner(winningPosition);
        const winnings = bets[winningPosition] * 2;
        let loss = 0;
        setWonAmount(winnings);
        for (let i = 0; i < bets.length; i++) {
          if (i !== winningPosition) {
            loss += bets[i];
          }
        }
        setLostAmount(loss);
        setBalance((prevBalance) => prevBalance + winnings - loss);
        setTimeout(() => {
          setWinner(null);
          setBets([0, 0, 0, 0, 0, 0]);
          setTimer(10);
          setActive(true);
          setWonAmount(null);
          setLostAmount(null);
        }, 5000);
      }, 2000);
    }
  }, [timer, bets]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <Typography variant="h5">
        Balance:{" "}
        <span
          style={{ color: balance > 0 ? "green" : "red", fontWeight: "bold" }}
        >
          ${balance}
        </span>
      </Typography>

      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {bets.map((bet, index) => (
          <Grid item key={index}>
            <Button
              variant="contained"
              onClick={() => handleBet(index)}
              disabled={!active}
            >
              Dice {index + 1}
              <br />
              Bet: ${bet}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6">Time Remaining: {timer} seconds</Typography>

      {winner !== null && (
        <Typography variant="h6">
          Dice <span style={{ fontWeight: "bold" }}>{winner + 1}</span> Won this
          Move!
        </Typography>
      )}
      {wonAmount !== null && lostAmount !== null && (
        <Typography variant="h6">
          You've Won{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
            ${wonAmount}
          </span>{" "}
          and Lost{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            ${lostAmount}
          </span>
        </Typography>
      )}
    </div>
  );
};

export default App;
