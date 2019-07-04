import React from "react";
import Card from "./Card";

class PlayerHand extends React.Component {
  render() {
    return (
      <div className="hand">
        {this.props.hand.map(card => {
          return <Card card={card} />;
          // <img src={card.image} />;
        })}
      </div>
    );
  }
}

export default PlayerHand;
