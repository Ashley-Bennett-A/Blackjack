import React from "react";

const Balance = props => {
  return (
    <div className="numbers">
      <h3 className="balance">Balance: {props.balance}</h3>
    </div>
  );
};

export default Balance;
