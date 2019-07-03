import React from "react";
import logo from "./logo.svg";
import "./App.css";
import PlayerHand from "./components/PlayerHand";
import DealerHand from "./components/DealerHand";

class App extends React.Component {
  state = {
    deckID: null,
    cardsRemaining: null,
    shuffled: false,
    playerHand: [],
    playerValue: 0,
    playerBust: false,
    playerStand: false,
    playerWin: null,
    dealerHand: [],
    dealerValue: 0,
    dealerValueHidden: true,
    dealerBust: false,
    dealerWin: null,
    push: null
  };

  componentDidMount() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
      .then(deck => {
        return deck.json();
      })
      .then(data => {
        // console.log(data);
        this.setState({
          deckID: data.deck_id,
          cardsRemaining: data.remaining,
          shuffled: data.shuffled
        });
      });
  }

  setValuePlayer = hand => {
    let total = 0;
    for (let i = 0; i < hand.length; i++) {
      // console.log(hand[i].value);
      // if  else
      if (hand[i].value === "ACE") {
        if (this.state.playerValue > 10 || total > 10) {
          let value = 1;
          console.log("adding 1");
          total += value;
        } else {
          let value = 11;
          // console.log("adding 11");
          total += value;
        }
      } else if (
        hand[i].value === "JACK" ||
        hand[i].value === "KING" ||
        hand[i].value === "QUEEN"
      ) {
        let value = 10;
        // console.log("adding 10");
        total += value;
      } else {
        let value = parseInt(hand[i].value);
        // console.log(`adding ${hand[i].value}`);
        total += value;
      }
    }
    // console.log(total);
    if (total > 21) {
      this.setState({ playerBust: true });
    }
    this.setState({ playerValue: total });
  };

  setValueDealer = hand => {
    let total = 0;
    for (let i = 0; i < hand.length; i++) {
      console.log(hand[i].value);
      // if  else
      if (hand[i].value === "ACE") {
        if (this.state.dealerValue > 10 || total > 10) {
          let value = 1;
          console.log("adding 1");
          total += value;
        } else {
          let value = 11;
          console.log("adding 11");
          total += value;
        }
      } else if (
        hand[i].value === "JACK" ||
        hand[i].value === "KING" ||
        hand[i].value === "QUEEN"
      ) {
        let value = 10;
        console.log("adding 10");
        total += value;
      } else {
        let value = parseInt(hand[i].value);
        console.log(`adding ${hand[i].value}`);
        total += value;
      }
    }
    console.log(total);
    if (total > 21) {
      this.setState({ dealerBust: true });
    }
    this.setState({ dealerValue: total });
  };

  deal = () => {
    fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=2`
    )
      .then(cards => {
        return cards.json();
      })
      .then(data => {
        // console.log(data);
        this.setState({
          playerHand: data.cards,
          cardsRemaining: data.remaining
        });
        this.setValuePlayer(this.state.playerHand);
      });

    fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=2`
    )
      .then(cards => {
        return cards.json();
      })
      .then(data => {
        // console.log(data);
        this.setState({
          dealerHand: data.cards,
          cardsRemaining: data.remaining
        });
      });
  };

  hit = () => {
    if (!this.state.playerBust) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`
      )
        .then(cards => {
          return cards.json();
        })
        .then(data => {
          // console.log(data);
          let oldCards = this.state.playerHand;
          oldCards.push(...data.cards);
          this.setState({
            playerHand: oldCards,
            cardsRemaining: data.remaining
          });
          this.setValuePlayer(this.state.playerHand);
        });
    }
  };

  result = () => {
    clearInterval(this.dealerHit);
    console.log("resulting");
    let player = this.state.playerValue;
    let dealer = this.state.dealerValue;
    if (player < dealer && !this.state.dealerBust) {
      console.log("dealer win");
      this.setState({ playerWin: false, dealerWin: true });
    } else if (player < dealer && this.state.dealerBust) {
      console.log("player win");
      this.setState({ playerWin: true, dealerWin: false });
    } else if (player > dealer && !this.state.playerBust) {
      console.log("player win");
      this.setState({ playerWin: true, dealerWin: false });
    } else if (player > dealer && this.state.playerBust) {
      console.log("dealer win");
      this.setState({ playerWin: false, dealerWin: true });
    } else if (
      player === dealer &&
      !this.state.dealerBust &&
      !this.state.playerBust
    ) {
      console.log("push");
      this.setState({ push: true });
    } else console.log("broken");
  };

  dealerHit = () => {
    if (this.state.dealerValue < 17) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`
      )
        .then(cards => {
          return cards.json();
        })
        .then(data => {
          // console.log(data);
          let oldCards = this.state.dealerHand;
          oldCards.push(...data.cards);
          this.setState({
            dealerHand: oldCards,
            cardsRemaining: data.remaining
          });
          this.setValueDealer(this.state.dealerHand);
        });
    } else if (this.state.dealerValue >= 17 && this.state.dealerValue <= 21) {
      // clearInterval(this.dealerHit);
      console.log("dealer stand");
      this.result();
    } else if (this.state.dealerValue > 21) {
      // clearInterval(this.dealerHit);
      console.log("dealer bust");
      this.result();
    }
  };

  stand = () => {
    this.setState({ playerStand: true, dealerValueHidden: false });
    this.setValueDealer(this.state.dealerHand);
    setInterval(this.dealerHit, 1000);
  };

  newHand = () => {
    clearInterval(this.dealerHit);
    this.setState({
      shuffled: false,
      playerHand: [],
      playerValue: 0,
      playerBust: false,
      playerStand: false,
      playerWin: null,
      dealerHand: [],
      dealerValue: 0,
      dealerBust: false,
      dealerWin: null,
      push: null
    });

    this.deal();
  };

  render() {
    return (
      <div className="App">
        <div>
          {this.playerBust ? (
            <button onClick={this.deal}>New Deal</button>
          ) : (
            <button onClick={this.deal}>Deal</button>
          )}
        </div>

        <button onClick={this.newHand}>New hand</button>

        <button onClick={this.hit}>Hit</button>
        <button onClick={this.stand}>Stand</button>
        <PlayerHand hand={this.state.playerHand} />
        <h1>{this.state.playerValue}</h1>
        <DealerHand
          hand={this.state.dealerHand}
          stand={this.state.playerStand}
          evaluate={this.setValueDealer}
        />
        <div>
          {this.dealerValueHidden ? <h1>{this.state.dealerValue}</h1> : <h1 />}
        </div>
      </div>
    );
  }
}

export default App;
