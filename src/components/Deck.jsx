import React from "react";
import backCard from "./images/playing_card_back_png_1044088.png";

const Deck = props => {
  return (
    <div className="deck">
      <img src={backCard} alt="" />
    </div>
  );
};

export default Deck;
