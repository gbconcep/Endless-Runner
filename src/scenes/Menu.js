class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('title', './assets/title.png');
        this.load.image('background', './assets/background.png');
        this.load.image('gear', './assets/gear.png');
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_jump', './assets/sfx_jump.wav');
        this.load.audio('sfx_voice', './assets/sfx_voice.wav');
        this.load.audio('sfx_running', './assets/running.mp3');
        this.load.audio('sfx_death', './assets/death.wav');
    }

    create() {
        // this.wall = this.add.tileSprite(0, 0, 640, 480, 'wall').setOrigin(0, 0);
        this.wall = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.title = this.add.image(game.config.width/2, game.config.height/2, 'title').setOrigin(0.5, 0.5);
        this.title.setDisplaySize(game.config.width, game.config.height)
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFFFFFF).setOrigin(0, 0);
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
        let directionConfig = {
            fontFamily: 'Arial',
            fontSize: '20px',
            backgroundColor: 'cyan',
            color: 'purple',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // show menu text
        menuConfig.backgroundColor = 'cyan';
        menuConfig.color = '#000';
        directionConfig.fixedWidth = 0
        this.add.text(game.config.width/2, game.config.height/1.4 + borderUISize + borderPadding, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/3.2, game.config.height/6.5, 'Press UP key to jump', directionConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.4, game.config.height/6.5, 'Press DOWN key to slide', directionConfig).setOrigin(0.5);

        // Initialize variables
        this.currentTime = 0; 
        this.bestTime = game.bestTime || 0; 

        // Check if there is a high score
        if (game.bestTime === null) {
            this.bestTimeText = this.add.text(215, 15, `BEST TIME: 0:00`, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff'
            });
        } else {
            this.bestTimeText = this.add.text(215, 15, `BEST TIME: ${this.formatTime(game.bestTime)}`, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff'
            });
        }

        this.add.text(35, 420, `Game by Gavin Concepcion. Additional help from Dominic Fanaris.`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        });

        this.add.text(125, 440, `Music and sound effects from Freesound.org`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            game.settings = {
                jumpSpeed: 5,
                obstacleSpeed: 2,
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }

    updateBestTime(time) {
        if (time > game.bestTime) {
          game.bestTime = time;
          this.bestTimeText.setText(`BEST TIME: ${this.formatTime(game.bestTime)}`);
        }
      }

      formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedTime;
      }
    
}