"use strict";

import { SHIP_SIZE, BULLET_SIZE } from "./constants.js";

export default class Bullet {
    #board;
    #x;
    #y;
    #cellSize;
    #bulletSize;
    #element;

    constructor(board, x, y) {
        this.#board = board;
        this.#x = x;
        this.#y = y;
        this.#cellSize = SHIP_SIZE;
        this.#bulletSize = BULLET_SIZE;
        this.#element = document.createElement("div");
        this.#element.classList.add("bullet");
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get element() {
        return this.#element;
    }

    render() {
        this.#element.style.width = `${this.#bulletSize}px`;
        this.#element.style.height = `${this.#bulletSize}px`;
        this.#element.style.position = "absolute";
        this.updatePosition();
        this.#board.appendChild(this.#element);
    }

    //place the bullet dead center inside its grid cell
    updatePosition() {
        const left = this.#x * this.#cellSize + (this.#cellSize - this.#bulletSize) / 2;
        const top = this.#y * this.#cellSize + (this.#cellSize - this.#bulletSize) / 2;
        this.#element.style.left = `${left}px`;
        this.#element.style.top = `${top}px`;
    }

    //boundaries are defined in Game.js
    moveUp() {
        this.#y--;
        this.updatePosition();
    }
}
