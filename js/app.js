import Store from "./store.js";
import { View } from "./view.js";

const App = {
  // all of our selected HTML elelments

  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),

    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    console.log(p1Moves);
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });
    return {
      status:
        moves.length === 9 || winner !== null ? "complete" : "in-progress", // in-progress | complete
      winner, // 1 | 2 | null
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    // Done
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    //TODO
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("reset the game");
    });

    //TODO
    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("start the new game");
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });
    //TODO

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // console.log(`Square with id ${event.target.id} was clicked`);

        // check if there is already played or not , if played return

        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );

          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }

        // determine which player icon to add to the square
        const lastMove = App.state.moves?.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        // App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;
        square.replaceChildren(squareIcon);

        // Check if there a winnner or tie game
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          let message = "";
          if (game.winner) {
            App.$.modal.classList.toggle("hidden");
            message = `Player ${game.winner} wins!`;
          } else {
            message = `Tie game !`;
          }

          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store(players);
  view.bindGameResetEvent((event) => {
    view.closeModal();

    store.reset();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
  });

  view.bindNewRoundEvent((event) => {
    console.log("new Round event");
    console.log(event);
  });

  view.bindPlayerMoveEvent((square) => {
    // Checking is Clicked Square is already occupied or not
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }
    // place an icon of the current player in a square
    view.handlePlayerMove(square, store.game.currentPlayer);

    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);

    const { status } = store.game;
    if (status.isComplete) {
      view.openModal(status.winner ? `${status.winner.name}, wins ` : "Tie!");
    }
    // Set the next player's turn inidicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}
window.addEventListener("load", init);
