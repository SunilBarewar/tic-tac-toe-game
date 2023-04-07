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
// MVC pattern
function init() {
  // "View"
  const view = new View();
  // "Model"
  const store = new Store("game-state-storage-key", players);

  /**
   * Listen for changes to the game state, re-render view when change occurs.
   *
   * The `statechange` event is a custom Event defined in the Store class
   */

  store.addEventListener("state-change", () => {
    view.render(store.game, store.stats);
  });

  /**
   * When 2 players are playing from different browser tabs, listen for changes
   */

  window.addEventListener("storage", () => {
    console.log("state changed from another tab");
    view.render(store.game, store.stats);
  });

  // When the HTML document first loads, render the view based on the current state.
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    console.log(square);
    // Checking is Clicked Square is already occupied or not
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }
    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);
  });
}
window.addEventListener("load", init);
