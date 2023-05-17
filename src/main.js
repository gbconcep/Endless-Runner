/* Name:Gavin Concepcion
 Mod Title: Cyber Dash
Approx. Hours Spent: 25 (subject to change)
Physics Source: https://stackoverflow.com/questions/55302007/how-add-physics-to-phaser-3-sprite
Gravity: https://phasergames.com/using-gravity-in-phaser-3/
https://newdocs.phaser.io/docs/3.54.0/Phaser.GameObjects.Components.Size#setSize
Running Sound Effect from Sound Library: https://www.youtube.com/watch?v=GZmkrgndFOs
The biggest challeges that I faced was getting the sprites to work and change based off of the character's action as well as the jump physics.
An implementation I am proud of is implementing a sliding mechanic that helps avoid certain obstacles.
I'm very proud of the sprite I made for my player character. 
I really like the design I made for him. For the animations, I used the Mega Man sprite as a basis and it turned out great because of that.*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
}

let game = new Phaser.Game(config);
game.highScore = 0;

// set Ui sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//reserve keyboard vars
let keySPACE, keyUP, keyDOWN, keyLEFT;