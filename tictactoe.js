var isPlayerAWinner = function(board, player, cellsThatWon) {
	let winningCells = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var playerCells = board.map((e, i) => e === player ? i : '').filter(String)

  for(var i = 0; i < winningCells.length; i++) {
  	if(winningCells[i].every(val => playerCells.includes(val))) {
    	cellsThatWon.cells = _.clone(winningCells[i]);
    	return true;
    }
  }

	return false;
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
  }

	render() {
  	var selectedCellClassName = "cell selected";
    if(this.props.isWinning) {
      selectedCellClassName = selectedCellClassName + " winning";
    }
    switch(this.props.sign) {
      case 1:
        return(
          <div className={selectedCellClassName}>
              <i className="fa fa-circle-o"></i>
          </div>
        )
        break;
      case 2:
        return(
          <div className={selectedCellClassName}>
              <i className="fa fa-times"></i>
          </div>
        )
        break;
      default:
        return(
          <div className="cell" onClick={() => this.props.changeState(this.state.id)}>
          </div>
        )
        break;
    }
  }
}

class GameResult extends React.Component {
	render() {
  	var result = null
  	if(this.props.gameStatus > 0) {
    	result = <div className="result">
      						<div>Player {this.props.gameStatus} won</div>
      						<button className="btn btn-primary"
                  				onClick={() => this.props.resetGame()}>
                  	Play again
                  </button>
               </div>;
    } else if(this.props.gameStatus === 0) {
    	result = <div className="result">
      						<div>
      						<div>End of Game</div>
      						<button className="btn btn-primary"
                  				onClick={() => this.props.resetGame()}>
                  	Play again
                	</button>
                  </div>
               </div>;
    }
		return result;
  }
}

class Board extends React.Component {
  state = {
  	board: _.range(this.props.boardSize).fill(0),
    previouslyStartingPlayer: 1,
    currentPlayer: 1,
    gameStatus: null,
    winningCells: {cells: []}
  }

  changeState = (id) => {
    this.setState((prevState) => {
    	var currentPlayer = prevState.currentPlayer;
      if(currentPlayer === null) {
      	return;
      }
    	prevState.board[id] = currentPlayer;
      var status = this.getGameStatus(prevState.board, currentPlayer, prevState.winningCells);
      var nextPlayer = null;
      if(status === null) {
      	var nextPlayer = this.choosePlayer(currentPlayer);
      }
      return {
      	board: prevState.board,
      	currentPlayer: nextPlayer,
        gameStatus: status
      };
    });
  }

  resetGame = () => {
    this.setState((prevState) => {
      var nextStartingPlayer = this.choosePlayer(prevState.previouslyStartingPlayer);
      return {
      	board: _.range(this.props.boardSize).fill(0),
        previouslyStartingPlayer: nextStartingPlayer,
      	currentPlayer: nextStartingPlayer,
        gameStatus: null,
        winningCells: {cells: []}
      };
    });
  }

  getGameStatus = (board, player, winningCells) => {
  	if(isPlayerAWinner(board, player, winningCells)) {
    	return player;
    }
    var unusedCells = board.filter(x => x === 0).length;
    if(unusedCells === 0) {
    	return 0;
    }
    return null;
  }

  choosePlayer = (player) => {
  	if(player === 1) {
    	return 2;
    }
    if(player === 2) {
    	return 1;
    }
  }

	render() {
  	return(
    	<div>
        <div className="board">
          {this.state.board.map((number, id) =>
            <Cell key={id} id={id} sign={number} changeState={this.changeState} isWinning={this.state.winningCells.cells.includes(id)}/>
          )}
        </div>
        <GameResult gameStatus={this.state.gameStatus} resetGame={this.resetGame}/>
      </div>
    );
  }
}

class Game extends React.Component {
	static initialState = () => ({
  	boardSize: 9
  });

  state = Game.initialState();

	render() {
  	return (
    	<div>
      	<Board boardSize={this.state.boardSize}/>
      </div>
    );
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div >
      	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"/>
      	<Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
