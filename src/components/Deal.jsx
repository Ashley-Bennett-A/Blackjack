import React from "react";

const Deal = props => {
  let className;
  if (props.hand.length < 1 && props.stake > 0) {
    className = "deal greenDeal";
  } else {
    className = "deal redDeal";
  }

  return (
    <div className="deal">
      <div className={className} onClick={props.deal}>
        Deal
      </div>
    </div>
  );
};

export default Deal;
