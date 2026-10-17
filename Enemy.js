"use strict";

import Ship from "./Ship.js";
import { ENEMY_SHIP_COLOR } from "./constants.js";

export default class Enemy extends Ship {
    constructor(board, x, y) {
        super(board, x, y);
        this.color = ENEMY_SHIP_COLOR;
        this.element.classList.add("enemy");
    }

    //boundaries are defined in Game.js
    moveDown() {
        this.y++;
        this.updatePosition();
    }
}
