import React from "react";

const Card = props => {
  return (
    <div>
      <img src={props.card.image} alt="card" />
    </div>
  );
};

export default Card;
