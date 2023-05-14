class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('title', './assets/title.png');
        this.load.image('wall', './assets/wall.png');
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_jump', './assets/jumpgrunt.wav');
    }

    create() {
        // this.wall = this.add.tileSprite(0, 0, 640, 480, 'wall').setOrigin(0, 0);
        this.title = this.add.image(game.config.width/2, game.config.height/2, 'title').setOrigin(0.5, 0.5);
        this.title.setDisplaySize(game.config.width/2, game.config.height/2)
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // show menu text
        menuConfig.backgroundColor = 'cyan';
        menuConfig.color = '#000';
        this.add.text(game.config.width/1.85, game.config.height/1.4 + borderUISize + borderPadding, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        // show high score
        this.add.text(250, 420, 'HIGH SCORE:').setOrigin(0, 0);
        this.hiScore = this.add.text(400, 420, game.highScore);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            // easy mode
            game.settings = {
                jumpSpeed: 2,
                obstacleSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (game.highScore <= this.p1Score) {
            game.highScore = this.p1Score
            this.hiScore.text = game.highScore
        }
        // this.wall.tilePositionX += 4;
    }
}