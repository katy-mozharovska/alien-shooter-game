"use strict";

export const BOARD_COLUMNS = 8;
export const BOARD_ROWS = 11;
export const ENEMY_ROWS = 5;
export const SHIP_SIZE = 40;
export const BULLET_SIZE = 4;
export const POINTS_PER_ENEMY = 100;
export const SPEED_INCREASE_THRESHOLD = 10_000;
export const MAX_SPEED_LEVEL = 3;
export const SPEED_STEP_MS = 1000;
export const MAX_ENEMY_TICK_MS = 4500;
export const MIN_ENEMY_TICK_MS = 1500;
export const BULLET_TICK_MS = 100;
export const WARRIOR_SHIP_COLOR = "#00FFFF";
export const ENEMY_SHIP_COLOR = "#FF4040";

//helper function to check for missing HTML element
export const getRequiredElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} doesn't exist.`);
    }
    return element;
};

//dict that stores DOM node references
export const elements = {
    gameBoard: getRequiredElement("game-board"),
    scoreDisplay: getRequiredElement("score-display"),
    speedDisplay: getRequiredElement("speed-display"),
    speedSelect: getRequiredElement("speed-select"),
    startBtn: getRequiredElement("start-btn"),
    gameOverBanner: getRequiredElement("game-over-banner"),
    youWinBanner: getRequiredElement("you-win-banner"),
};
