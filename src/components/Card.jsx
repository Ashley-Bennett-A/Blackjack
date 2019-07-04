import React from "react";

const Card = props => {
  return (
    <div className="card">
      <img src={props.card.image} alt="card" />
    </div>
  );
};

export default Card;
