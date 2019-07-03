import React from "react";
import Card from "./Card";

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
      //   console.log(this.props.hand[0].image);
      return (
        <div className="hand">
          <Card card={this.props.hand[0]} />;
        </div>
      );
    }

    return (
      <div>
        <h1>Dealer's Hand</h1>
        <div className="hand" />
      </div>
    );
  }
}

export default DealerHand;
