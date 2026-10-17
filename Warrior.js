"use strict";

import Ship from "./Ship.js";
import { WARRIOR_SHIP_COLOR, BOARD_COLUMNS } from "./constants.js";

export default class Warrior extends Ship {
    constructor(board, x, y) {
        super(board, x, y);
        this.color = WARRIOR_SHIP_COLOR;
        this.element.classList.add("warrior");
    }

    //horizontal movement only
    move(direction) {
        if (this.x + direction >= 0 && this.x + direction < BOARD_COLUMNS) {
            this.x += direction;
            this.updatePosition();
        }
    }
}
