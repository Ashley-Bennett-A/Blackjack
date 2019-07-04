import React from "react";
import Card from "./Card";
import backCard from "./images/playing_card_back_png_1044088.png";

class DealerHand extends React.Component {
  render() {
    if (this.props.stand) {
      return (
        <div className="hand">
          {this.props.hand.map(card => {
            return <Card card={card} />;
          })}
        </div>
      );
    } else if (this.props.hand.length > 0) {
      return (
        <div className="hand">
          <Card card={this.props.hand[0]} />
          <div className="card">
            <img src={backCard} alt="card" />
          </div>
        </div>
      );
    }

    return <div className="hand" />;
  }
}

export default DealerHand;
