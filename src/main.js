// Name:Gavin Concepcion
// Mod Title: Jump and Shoot
// Approx. Hours Spent: 4 (subject to change)

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
let keySPACE, keyUP, keyDOWN;