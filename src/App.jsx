import React from "react";
import "./App.css";
import PlayerHand from "./components/PlayerHand";
import DealerHand from "./components/DealerHand";
import Chip from "./components/Chip";
import Balance from "./components/Balance";
import Stake from "./components/Stake";
import Options from "./components/Options";
import Deal from "./components/Deal";
import Instructions from "./components/Instructions";
import Deck from "./components/Deck";

class App extends React.Component {
  state = {
    balance: 1000,
    stake: 0,
    deckID: null,
    cardsRemaining: null,
    shuffled: false,
    playerHand: [],
    playerValue: 0,
    playerBust: false,
    playerStand: false,
    playerWin: false,
    dealerHand: [],
    dealerValue: 0,
    dealerValueHidden: true,
    dealerBust: false,
    dealerWin: false,
    push: false,
    blackJack: false
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
      this.stand();
    }
    if (total === 21 && hand.length === 2) {
      console.log("blackJack");
      this.setState({ blackJack: true });
      this.stand();
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
    if (this.state.cardsRemaining < 130) {
      let random = Math.floor(Math.random() * 10);
      if (random === 1) {
      }
    }
    if (this.state.stake > 0 && this.state.playerHand.length <= 0) {
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
    }
  };

  hit = () => {
    if (
      !this.state.playerBust &&
      this.state.playerHand.length >= 2 &&
      !this.state.playerStand
    ) {
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
    } else if (this.state.blackJack) {
      console.log("player Win");
      this.setState({ playerWin: true, dealerWin: false });
    } else if (
      player === dealer &&
      !this.state.dealerBust &&
      !this.state.playerBust
    ) {
      console.log("push");
      this.setState({ push: true });
    } else if (player > dealer && this.state.playerBust) {
      console.log("dealer win");
      this.setState({ playerWin: false, dealerWin: true });
    } else console.log("broken");
    this.resolveStake();
  };

  dealerHit = () => {
    let hit = setInterval(() => {
      if (this.state.dealerValue < 17) {
        fetch(
          `https://deckofcardsapi.com/api/deck/${
            this.state.deckID
          }/draw/?count=1`
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
        clearInterval(hit);
        console.log("dealer stand");
        this.result();
      } else if (this.state.dealerValue > 21) {
        clearInterval(hit);
        console.log("dealer bust");
        this.result();
      }
    }, 1000);
  };

  stand = () => {
    if (this.state.playerHand.length > 0) {
      this.setState({ playerStand: true, dealerValueHidden: false });
      this.setValueDealer(this.state.dealerHand);
      if (!this.state.playerBust) {
        this.dealerHit();
      } else if (this.state.playerBust) {
        this.result();
      } else if (this.state.blackJack) {
        this.result();
      }
    }
  };

  addStake = value => {
    if (this.state.playerHand.length <= 0) {
      let oldBalance = this.state.balance;
      let oldStake = parseInt(this.state.stake);
      if (value <= oldBalance) {
        let newBalance = oldBalance - value;
        let newStake = (oldStake += parseInt(value));
        this.setState({ balance: newBalance, stake: newStake });
      }
    } else if (this.state.stake === 0 && this.state.playerHand.length > 0) {
      this.setState({
        shuffled: false,
        playerHand: [],
        playerValue: 0,
        playerBust: false,
        playerStand: false,
        playerWin: false,
        dealerHand: [],
        dealerValue: 0,
        dealerBust: false,
        dealerWin: false,
        push: false,
        blackJack: false
      });
      let oldBalance = this.state.balance;
      let oldStake = parseInt(this.state.stake);
      if (value <= oldBalance) {
        let newBalance = oldBalance - value;
        let newStake = (oldStake += parseInt(value));
        this.setState({ balance: newBalance, stake: newStake });
      }
    }
  };

  resolveStake = () => {
    if (this.state.playerWin && !this.state.blackJack) {
      let stake = this.state.stake;
      let oldBalance = this.state.balance;
      let winnings = stake * 2;
      let newBalance = winnings + oldBalance;
      this.setState({ balance: newBalance, stake: 0 });
    } else if (this.state.playerWin && this.state.blackJack) {
      let stake = this.state.stake;
      let oldBalance = this.state.balance;
      let winnings = stake * 2.5;
      let newBalance = winnings + oldBalance;
      this.setState({ balance: newBalance, stake: 0 });
    } else if (this.state.dealerWin) {
      this.setState({ stake: 0 });
    } else if (this.state.push) {
      let stake = this.state.stake;
      let oldBalance = this.state.balance;
      let winnings = stake;
      let newBalance = winnings + oldBalance;
      this.setState({ balance: newBalance, stake: 0 });
    }
  };

  doubleDown = () => {
    if (this.state.playerHand.length > 0 && !this.state.playerStand) {
      if (!this.state.playerBust && this.state.playerHand.length >= 2) {
        fetch(
          `https://deckofcardsapi.com/api/deck/${
            this.state.deckID
          }/draw/?count=1`
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
      let oldBalance = this.state.balance;
      let oldStake = parseInt(this.state.stake);
      if (oldStake <= oldBalance) {
        let newBalance = oldBalance - oldStake;
        let newStake = oldStake * 2;
        this.setState({ balance: newBalance, stake: newStake });
        setTimeout(this.stand(), 500);
      }
    }
  };

  render() {
    return (
      <div className="App">
        <Deck />
        <DealerHand
          hand={this.state.dealerHand}
          stand={this.state.playerStand}
          evaluate={this.setValueDealer}
        />
        <h3>Dealer total: {this.state.dealerValue}</h3>

        <PlayerHand hand={this.state.playerHand} />
        <h3>Your total: {this.state.playerValue}</h3>
        <Instructions
          push={this.state.push}
          dealerWin={this.state.dealerWin}
          playerWin={this.state.playerWin}
          stake={this.state.stake}
          hand={this.state.playerHand}
          blackJack={this.state.blackJack}
        />
        <div className="mid-row">
          <Balance balance={this.state.balance} />
          <Deal
            deal={this.deal}
            hand={this.state.playerHand}
            stake={this.state.stake}
          />
          <Stake stake={this.state.stake} />
        </div>

        <Options
          hit={this.hit}
          stand={this.stand}
          doubleDown={this.doubleDown}
        />
        <div className="chips">
          <Chip value="1" color="white" addStake={this.addStake} />
          <Chip value="5" color="red" addStake={this.addStake} />
          <Chip value="25" color="green" addStake={this.addStake} />
          <Chip value="50" color="black" addStake={this.addStake} />
          <Chip value="100" color="purple" addStake={this.addStake} />
          <Chip value="500" color="orange" addStake={this.addStake} />
        </div>
      </div>
    );
  }
}

export default App;
