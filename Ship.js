"use strict";

import { SHIP_SIZE } from "./constants.js";

//base blueprint for the warrior and enemies
export default class Ship {
    #board;
    #x;
    #y;
    #size;
    #element;
    #color;

    constructor(board, x, y) {
        this.#board = board;
        this.#x = x;
        this.#y = y;
        this.#size = SHIP_SIZE;
        this.#element = document.createElement("div");
        this.#element.classList.add("ship");
        this.#color = "#FFFFFF";
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
    }

    get element() {
        return this.#element;
    }

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    render() {
        this.#element.style.width = `${this.#size}px`;
        this.#element.style.height = `${this.#size}px`;
        this.#element.style.backgroundColor = this.#color;
        this.#element.style.position = "absolute";
        this.updatePosition();
        this.#board.appendChild(this.#element);
    }

    updatePosition() {
        this.#element.style.left = `${this.#x * this.#size}px`;
        this.#element.style.top = `${this.#y * this.#size}px`;
    }
}
