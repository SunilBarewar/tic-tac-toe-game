import Store from "./store.js";
import { View } from "./view.js";

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
  const store = new Store("live-t3-storage-key", players);
  view.bindGameResetEvent((event) => {
    view.closeAll();

    store.reset();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);

    const { playerWithStats, ties } = store.stats;

    view.updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    // console.log(store.stats);
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();

    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);

    const { playerWithStats, ties } = store.stats;

    view.updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
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
