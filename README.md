BrAwSer Game

Project Overview
A retro-style space arcade game built using vanilla HTML5, CSS3, and JavaScript. Developed as an educational project to practice DOM manipulation, BOM, and OOP principles.

Controls

* Left / Right Arrow Keys: Move the player ship horizontally.
* Spacebar: Fire bullets upward.
* Start Button: Initialize and start the game.

Game Rules, Speed, and Levels

* Objective: Destroy incoming enemy waves while preventing them from reaching the bottom of the board.
* Scoring: Each destroyed enemy awards 100 points.
* Speed Levels: The game features 3 speed levels. Every 10,000 points scored automatically increases the speed level, making enemies move down faster. You can also select a starting speed level from the dropdown menu before launching the game.

Win and Loss Conditions

* Game Over (Loss): Triggered if any enemy ship reaches the bottom row of the game board.
* You Win: Triggered after clearing all enemy waves and successfully completing the maximum speed level (Level 3).

Project Structure

* index.html: Main application HTML markup.
* style.css: Retro window styling, layout, and visual effects.
* constants.js: Configuration values and DOM element cache.
* Ship.js: Base class for grid entities.
* Warrior.js: Player ship logic and boundary checks.
* Enemy.js: Enemy movement logic.
* Bullet.js: Bullet positioning and movement logic.
* Game.js: Core game engine, loops, collision detection, and state management.
* script.js: Application entry point, event listeners, and error handling.