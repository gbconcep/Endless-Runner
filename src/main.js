// Name:Gavin Concepcion
// Mod Title: Rocket Patrol Modpack X
// Approx. Hours Spent: 1 (subjec to change)
//
// Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) (5)
// Music: Nexus by IMG; Taken from uppbeat.io
//
// Create 4 new explosion sound effects and randomize which one plays on impact (10)
// Math randomizer code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//
// Allow the player to control the Rocket after it's fired (5)

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set Ui sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;