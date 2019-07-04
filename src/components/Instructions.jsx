import React from "react";

const Instructions = props => {
  let instructions;
  if (props.stake <= 0 && !props.dealerWin && !props.playerWin && !props.push) {
    instructions = "Click on the chips to place a stake";
  } else if (props.stake > 0 && props.hand.length <= 0) {
    instructions = "Hit the deal button to start";
  } else if (props.hand.length > 0 && !props.dealerWin && !props.playerWin) {
    instructions = "";
  } else if (props.dealerWin) {
    instructions = "Dealer wins! Set a new stake to start a new round";
  } else if (props.playerWin && props.blackJack) {
    instructions =
      "Player wins with Blackjack! Set a new stake to start a new round";
  } else if (props.playerWin) {
    instructions = "Player wins! Set a new stake to start a new round";
  } else if (props.push) {
    instructions = "Push! Set a new stake to start a new round";
  } else {
    console.log("error");
  }
  return (
    <div className="instructions">
      <h2>{instructions}</h2>
    </div>
  );
};

export default Instructions;
