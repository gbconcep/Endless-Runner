class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('smallship', './assets/smallship.png');
        this.load.image('saucer', './assets/saucer.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('space', './assets/space.png');
        this.load.image('particle', './assets/explosion.png');
        this.load.image('asteroid', './assets/asteroid-lane.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameWidth: 32, startFrame: 0, endFrame: 9});
        // load music
        this.load.audio('sfx_play_music', './assets/nexus_music.mp3'); 
      }

    create() {
        this.sfx = this.sound.add('sfx_play_music');
        this.sfx.play()
        // background tiles
        this.space = this.add.tileSprite(0, 0, 640, 480, 'space').setOrigin(0, 0);
        this.asteroid = this.add.tileSprite(0, 0, 640, 480, 'asteroid').setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'smallship', 0, 30).setOrigin(0, 0);
        this.ship01.moveSpeed = game.settings.spaceshipSpeed*3
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'saucer', 0, 20).setOrigin(0,0);
        this.ship02.moveSpeed = game.settings.spaceshipSpeed*2
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        // border
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.width - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initiate score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize*16 + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);  
        // GAME OVER FLAG
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/1.9, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/1.9, game.config.height/2 + 64, 'PRESS (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        console.log(this.clock.elapsed);

        // display timer
        let timeConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeRight = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.clock.delay/100000, timeConfig);

        // fire text
        this.add.text(game.config.width/2.5, game.config.height/6.5, 'FIRE', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.6, game.config.height/6.5, 'COMPUTER', scoreConfig).setOrigin(0.5);
        
        // // high score display
        this.add.text(250, 420, 'HIGH SCORE:').setOrigin(0, 0);
        this.hiScore = this.add.text(400, 420, game.highScore);
    }

    update() {
        // speed increase after 30 seconds
        if (this.clock.elapsed > 30000) {
            this.ship01.moveSpeed = game.settings.spaceshipSpeed*5
            this.ship02.moveSpeed = game.settings.spaceshipSpeed*4
            this.ship03.moveSpeed = game.settings.spaceshipSpeed*3
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            console.log('reset')
            this.sfx.play()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            this.sfx.pause()
        }
        this.space.tilePositionX -= 4;
        this.asteroid.tilePositionX -= 7;

        // clock update
        this.timeRight.text = Math.ceil(this.clock.delay - this.clock.elapsed) / 1000;

        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update(); 
            this.ship02.update();
            this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.clock.elapsed -= 5000
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.clock.elapsed -= 7000
        }

        // highScore
        if (game.highScore <= this.p1Score) {
            game.highScore = this.p1Score
            this.hiScore.text = game.highScore
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
          return true;
        } else {
          return false;
        }
    }

    shipExplode(ship) {
        console.log("hello")
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        console.log(this.p1Score)
        this.scoreLeft.text = this.p1Score;

        // explosion adds to timer
        // this.clock.elapsed -= 5000

        // random explosion sounds
        let random = Math.floor(Math.random() * 4) + 1
        console.log(random)
        switch (random)
        {
            case 1:
                this.sound.play('sfx_explosion1');
                break;
            case 2:
                this.sound.play('sfx_explosion2');
                break;
            case 3:
                this.sound.play('sfx_explosion3');
                break;
            case 4:
                this.sound.play('sfx_explosion4');
                break;
            default:
                break;
        }
    }
}


