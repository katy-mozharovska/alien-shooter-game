"use strict";

import Warrior from "./Warrior.js";
import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    ENEMY_ROWS,
    POINTS_PER_ENEMY,
    SPEED_INCREASE_THRESHOLD,
    MAX_ENEMY_TICK_MS,
    MIN_ENEMY_TICK_MS,
    SPEED_STEP_MS,
    MAX_SPEED_LEVEL,
    BULLET_TICK_MS
} from "./constants.js";

//core controller of the game
export default class Game {
    #centerColumn = Math.floor(BOARD_COLUMNS / 2);
    #bottomRow = BOARD_ROWS - 1;
    #elements;
    #score = 0;
    #speedLevel = 1;
    #scoreAtLastSpeedIncrease = 0;
    #warrior;
    #enemies = [];
    #bullets = [];
    #isRunning = false;
    #intervalId = null;
    #bulletIntervalId = null;

    constructor(elements) {
        this.#elements = elements;
        this.#warrior = new Warrior(
            this.#elements.gameBoard, this.#centerColumn, this.#bottomRow);
        this.#updateScoreDisplay();
        this.#updateSpeedDisplay();
    }

    #updateScoreDisplay() {
        this.#elements.scoreDisplay.textContent = this.#score;
    }

    #updateSpeedDisplay() {
        this.#elements.speedDisplay.textContent = this.#speedLevel;
    }

    handleKeyDown(event) {
        //prevent movement when game is inactive
        if (this.#isRunning) {
            if (event.key === "ArrowLeft") {
                this.#warrior.move(-1);
            } else if (event.key === "ArrowRight") {
                this.#warrior.move(1);
            } else if (event.code === "Space") {
                event.preventDefault(); //prevent moving web page
                this.#shoot();
            }
        }
    }

    //create a bullet
    #shoot() {
        const bullet = new Bullet(
            this.#elements.gameBoard, this.#warrior.x, this.#warrior.y);
        this.#bullets.push(bullet);
        bullet.render();
    }

    //setting the game in motion
    start() {
        if (this.#isRunning) {
            return;
        }
        this.#reset();
        const selectedSpeed = Number(this.#elements.speedSelect.value);
        this.#speedLevel = Number.isInteger(selectedSpeed)
            && selectedSpeed >= 1
            && selectedSpeed <= MAX_SPEED_LEVEL
            ? selectedSpeed
            : 1;
        this.#scoreAtLastSpeedIncrease = 0;
        this.#updateSpeedDisplay();
        this.#isRunning = true;
        this.#warrior.render();
        this.#mountEnemyWave();
        this.#startGameLoop();
        this.#startBulletLoop();
    }

    //state sanitizer
    #reset() {
        this.#stopLoops();
        this.#score = 0;
        this.#speedLevel = 1;
        this.#scoreAtLastSpeedIncrease = 0;
        this.#updateScoreDisplay();
        this.#updateSpeedDisplay();
        this.#enemies.forEach((enemy) => enemy.element.remove());
        this.#enemies = [];
        this.#bullets.forEach((bullet) => bullet.element.remove());
        this.#bullets = [];
        this.#warrior.x = this.#centerColumn;
        this.#warrior.y = this.#bottomRow;
        this.#warrior.updatePosition();
        this.#elements.gameOverBanner.hidden = true;
        this.#elements.youWinBanner.hidden = true;
    }

    //build the enemies
    #createEnemyWave() {
        const enemies = [];
        for (let row = 0; row < ENEMY_ROWS; row++) {
            const startColumn = Math.max(0, row - 1);
            const enemiesInRow = BOARD_COLUMNS - 2 * startColumn;
            for (let column = startColumn;
                column < enemiesInRow + startColumn;
                column++) {
                enemies.push(
                    new Enemy(this.#elements.gameBoard, column, row)
                );
            }
        }
        return enemies;
    }

    //mount enemies to the DOM
    #mountEnemyWave() {
        this.#enemies = this.#createEnemyWave();
        this.#enemies.forEach((enemy) => enemy.render());
    }

    //convert speed level into millisecond intervals
    #getEnemyTickMs() {
        const interval = MAX_ENEMY_TICK_MS - (this.#speedLevel - 1) * SPEED_STEP_MS;
        return Math.max(interval, MIN_ENEMY_TICK_MS);
    }

    //control execution flow for enemies
    #startGameLoop() {
        this.#intervalId = setInterval(() => {
            if (!this.#isRunning) {
                return;
            }
            this.#enemies.forEach((enemy) => {
                enemy.moveDown();
            });
            if (this.#enemies.some((enemy) => enemy.y >= this.#bottomRow)) {
                this.#endGame();
            }
        }, this.#getEnemyTickMs());
    }

    //control execution flow for bullets and enemies removing
    #startBulletLoop() {
        this.#bulletIntervalId = setInterval(() => {
            if (!this.#isRunning) {
                return;
            }
            this.#updateBullets();
            this.#checkCollisions();
            if (this.#enemies.length === 0) {
                if (this.#speedLevel === MAX_SPEED_LEVEL) {
                    this.#endGame(true);
                    return;
                }
                this.#mountEnemyWave();
            }
        }, BULLET_TICK_MS);
    }

    //move bullets and remove them after reaching boundary
    #updateBullets() {
        this.#bullets = this.#bullets.filter((bullet) => {
            bullet.moveUp();
            if (bullet.y < 0) {
                bullet.element.remove();
                return false;
            }
            return true;
        });
    }

    //remove bullet and enemy when they met 
    #checkCollisions() {
        const bulletsToRemove = [];
        this.#bullets.forEach((bullet) => {
            const matchingEnemy = this.#enemies.find(
                (enemy) => bullet.x === enemy.x && bullet.y === enemy.y);
            if (matchingEnemy) {
                bulletsToRemove.push(bullet);
                matchingEnemy.element.remove();
                this.#enemies = this.#enemies.filter(
                    (enemy) => enemy !== matchingEnemy);
                this.#score += POINTS_PER_ENEMY;
                this.#updateScoreDisplay();
                this.#increaseSpeed();
            }
        });
        bulletsToRemove.forEach((bullet) => {
            bullet.element.remove();
        });
        this.#bullets = this.#bullets.filter(
            (bullet) => !bulletsToRemove.includes(bullet)
        );
    }

    //dynamically scale game speed
    #increaseSpeed() {
        const pointsSinceLastIncrease =
            this.#score - this.#scoreAtLastSpeedIncrease;
        if (pointsSinceLastIncrease >= SPEED_INCREASE_THRESHOLD
            && this.#speedLevel < MAX_SPEED_LEVEL) {
            this.#speedLevel++;
            this.#scoreAtLastSpeedIncrease = this.#score;
            this.#updateSpeedDisplay();
            this.#restartGameLoop(); 
        }
    }

    //initialize a new setInterval ticking for enemies at the faster speed rate
    #restartGameLoop() {
        if (this.#intervalId !== null) {
            clearInterval(this.#intervalId);
        }
        this.#intervalId = null;
        if (this.#isRunning) {
            this.#startGameLoop();
        }
    }

    //game termination and showing result on UI
    #endGame(won = false) {
        this.#isRunning = false;
        this.#stopLoops();
        if (won) {
            this.#elements.youWinBanner.hidden = false;
        } else {
            this.#elements.gameOverBanner.hidden = false;
        }
    }

    //enemies and bullets loops cleanup
    #stopLoops() {
        if (this.#intervalId !== null) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
        if (this.#bulletIntervalId !== null) {
            clearInterval(this.#bulletIntervalId);
            this.#bulletIntervalId = null;
        }
    }
}
