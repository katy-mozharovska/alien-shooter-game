"use strict";

import { elements } from "./constants.js";
import Game from "./Game.js";

const initGame = () => {
    const game = new Game(elements);
    elements.startBtn.addEventListener("click", () => {
        game.start();
    });
    document.addEventListener("keydown", (event) => {
        game.handleKeyDown(event);
    });
};

try {
    initGame();
} catch (exception) {
    console.error(exception);
}
