// Name:Gavin Concepcion
// Mod Title: Rocket Patrol Modpack X
// Approx. Hours Spent: 6 (subject to change)
//
// Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) (5)
// - Music: Nexus by IMG; Taken from uppbeat.io
//
// Create 4 new explosion sound effects and randomize which one plays on impact (10)
// - Sound effects recorded by me in Audacity
// - Math randomizer code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//
// Allow the player to control the Rocket after it's fired (5)
//
// Display the time remaining (in seconds) on the screen (10)
//
// Create a new title screen (e.g., new artwork, typography, layout) (10)
// -Title screen made in pixelart
// 
// Implement the 'FIRE' UI text from the original game (5)
//
// Create a new scrolling tile sprite for the background (5)
// - Tile sprite made in pixelart
//
// Track a high score that persists across scenes and display it in the UI (5)
//
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
// - Made two different enemy Spaceship types, with different sizes and speeds. They're in the back to make them harder to hit. 
//
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
// - Small and saucer types are the only ones to add time to the clock because they're harder to hit.

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);
game.highScore = 0;

// set Ui sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;