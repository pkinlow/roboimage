import React, { Component } from 'react';
const [ ROBO, MONSTER, HEAD, KITTY ] = [ 1, 2, 3, 4 ];
const [ WIN, LOSE ] = [ 1, 2 ];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.resetGame = this.resetGame.bind(this);
  }

  getId() {
    return Date.now();
  }

  resetGame() {
    this.setState(this.initialState());
  }

  initialState() {
    return Object.assign({}, {
      player1: '',
      player2: '',
      player1Set: '',
      player2Set: '',
      player1Image: '',
      player2Image: '',
      player1ImageStatus: '',
      player2ImageStatus: '',
      winner: '',
      winnerMessage: ''
    });
  }

  setPlayerId(playerKey) {
    const { player1, player2, player1Set, player2Set } = this.state;
    const id = this.getId();
    const set = this.getRandomSet();
    const playerSetKey = playerKey + 'Set';
    const isGameComplete = player1 && true || player2 && true || false;

    this.setState((prevState) => {
      return {
        [playerKey]: id,
        [playerSetKey]: set,
      };
    }, () => {
      this.getImage(playerKey);
    });

    // Small Delay Before Showing Winner
    setTimeout(() => {
      this.setState((prevState) => {
        const winner = this.checkWinner(isGameComplete, playerSetKey, set);

        return {
          winner: winner,
          winnerMessage: this.winnerMessage(winner)
        };
      });
    }, 1500);
  }

  getRandomSet() {
    const min = 1;
    const max = 4;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  winnerMessage(winner) {
    if (winner === 'player1') {
      return 'Player 1 Wins';
    } else if (winner === 'player2') {
      return 'Player 2 Wins';
    } else if (winner === 'draw') {
      return 'Draw';
    }

    return '';
  }

  getImage(playerKey) {
    const { player1, player2, player1Set, player2Set } = this.state;

    if (player1 && playerKey === 'player1') {
      const player1ImgUrl = `https://robohash.org/${player1}?set=set${player1Set}`;
      const image1 = new Image();
      image1.src = player1ImgUrl;
      image1.onload = () => {
        this.setState({
          player1Image: <img className="complete" src={player1ImgUrl} />,
          player1ImageStatus: 'complete'
        });
      };

      this.setState({
        player1Image: <img className="loading" src={player1ImgUrl} />,
        player1ImageStatus: 'loading'
      });
    } else if (player2 && playerKey === 'player2') {
      const player2ImgUrl = `https://robohash.org/${player2}?set=set${player2Set}`;
      const image2 = new Image();
      image2.src = player2ImgUrl;
      image2.onload = () => {
        this.setState({
          player2Image: <img className="complete" src={player2ImgUrl} />,
          player2ImageStatus: 'complete'
        });
      };

      this.setState({
        player2Image: <img className="loading" src={player2ImgUrl} />,
        player2ImageStatus: 'loading'
      });
    }
  }

  getClickHandler(playerKey) {
    return (e) => {
      e.preventDefault();
      if (!this.state[playerKey]) {
        this.setPlayerId(playerKey);
      }
    };
  }

  checkWinner(isGameComplete, playerSetKey, set) {
    const DEFAULT_VALUE = null;
    let player1Points = DEFAULT_VALUE;


    if (!isGameComplete) {
      return '';
    }

    // Determine Selected Set
    let player1Set, player2Set;

    if (playerSetKey === 'player1Set') {
      player1Set = set;
      player2Set = this.state.player2Set;
    } else {
      player2Set = set;
      player1Set = this.state.player1Set;
    }

    console.log('set', set);
    console.log('player1Set', player1Set, 'player2Set', player2Set);

    /*
    Robots 1
    Monster 2
    Heads 3
    KITTYs 4

    Robots > Monsters
    Monster > Kittys
    Kittys > Heads
    Heads > Robots

    Robots = Kittys
    Monsters = Heads
    */

    const profiles = {
      [ROBO]: {
        [MONSTER]: WIN,
        [HEAD]: LOSE
      },
      [MONSTER]: {
        [KITTY]: WIN,
        [ROBO]: LOSE
      },
      [HEAD]: {
        [ROBO]: WIN,
        [KITTY]: LOSE
      },
      [KITTY]: {
        [HEAD]: WIN,
        [MONSTER]: LOSE
      }
    };

    console.log('profiles', profiles);
    console.log('profiles[player1Set]', profiles[player1Set]);
    console.log('profiles[player1Set][player2Set]', profiles[player1Set][player2Set]);

    player1Points = profiles[player1Set][player2Set] || DEFAULT_VALUE;

    if (player1Points === WIN) {
      return 'player1';
    } else if (player1Points === LOSE) {
      return 'player2';
    }

    return 'draw';
  }

  setClassNames(classNames, playerKey) {
    const { winner } = this.state;
    const statusClass = this.state[playerKey + 'ImageStatus'];
    classNames = classNames + ' ' + statusClass;

    if (winner === 'draw') {
      return classNames;
    } else if ( winner && winner === playerKey) {
      return classNames + ' win';
    } else if ( winner && winner !== playerKey) {
      return classNames + ' lose';
    }

    return classNames;
  }

  render() {
    const { winnerMessage, player1Image, player2Image } = this.state;

    return (
      <React.Fragment>
        <div className="battleground">
          <div
            className={this.setClassNames("player1 playerbox", 'player1')}
            onClick={this.getClickHandler('player1')}>{player1Image}</div>
          <div
            className={this.setClassNames("player2 playerbox", 'player2')}
            onClick={this.getClickHandler('player2')}>{player2Image}</div>
        </div>
        <p className="reset"><button onClick={this.resetGame}>Reset</button></p>
        <p className="contest-title">{ winnerMessage }</p>
      </React.Fragment>
    );
  }
}
