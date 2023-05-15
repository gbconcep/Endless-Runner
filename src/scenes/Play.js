class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('block', './assets/block.png');
        this.load.image('box', './assets/box.png');
        this.load.image('wall', './assets/wall.png');
        this.load.image('particle', './assets/explosion.png');
        this.load.image('floor', './assets/floor.png');
        // load spritesheet
        this.load.atlas('character', 'assets/character.png', 'assets/sprites.json');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameWidth: 32, startFrame: 0, endFrame: 9});
        // load music
        this.load.audio('sfx_play_music', './assets/sfx_music.wav'); 
      }

    create() {
        this.sfx = this.sound.add('sfx_play_music');
        this.sfx.setLoop(true);
        this.sfx.play()
        // background tiles
        this.wall = this.add.tileSprite(0, 0, 640, 480, 'wall').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 0, 640, 480, 'floor').setOrigin(0, 0);
        // running animation
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNames('character', {prefix: 'Character Sprite ', start: 1, end: 3}),
        frameRate: 12,
        repeat: -1
        });
        //jump animation
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('character', {prefix: 'Character Sprite ', start: 4, end: 4}),
        frameRate: 9,
        repeat: -1
        });
        // slide animation
        this.anims.create({
            key: 'slide',
            frames: this.anims.generateFrameNames('character', {prefix: 'Character Sprite ', start: 10, end: 10}),
        frameRate: 9,
        repeat: -1
        });
        // character
        this.p1Character = new Character(this, game.config.width/6, game.config.height*0.71, 'character').setOrigin(0.5, 0);
        // add obstacles (x3)
        this.obstacle01 = new Obstacles(this, game.config.width+ borderUISize*10, game.config.height*0.72, 'rocket', 0, 0).setOrigin(0, 0);
        this.obstacle01.moveSpeed = game.settings.obstacleSpeed
        this.obstacle02 = new Obstacles(this, game.config.width + borderUISize*5, game.config.height*0.25, 'block', 0, 25).setOrigin(0,0);
        this.obstacle02.setDisplaySize(game.config.width/10, game.config.height/2)
        this.obstacle02.moveSpeed = game.settings.obstacleSpeed
        this.obstacle03 = new Obstacles(this, game.config.width, game.config.height*0.73, 'box', 0, 0).setOrigin(0,0);
        this.obstacle03.moveSpeed = game.settings.obstacleSpeed
        // speed increase after 30 seconds
        // border
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.width - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // this.anims.create({
        //     key: 'run',
        //     frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2, first: 0}),
        //     frameRate: 30
        // });
        // initiate score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
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

        // this.scoreLeft = this.add.text(borderUISize*16 + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);  
        // GAME OVER FLAG
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/1.9, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/1.9, game.config.height/2 + 64, 'PRESS SPACE to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
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
        this.timeRight = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.clock.elapsed, timeConfig);

        // how to play
        this.add.text(game.config.width/2.4, game.config.height/6.5, 'Press UP key to jump', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.3, game.config.height/6.5, 'Press DOWN ket to slide', scoreConfig).setOrigin(0.5);
        
        // high score display
        // this.add.text(250, 420, 'HIGH SCORE:').setOrigin(0, 0);
        // this.hiScore = this.add.text(400, 420, game.highScore);
    }


    update() {
        this.time.delayedCall(30000, () => {
            console.log('call')
            this.obstacle01.moveSpeed*2
            this.obstacle02.moveSpeed*2
            this.obstacle03.moveSpeed*2
        })
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
            console.log('reset')
            this.sfx.play()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            this.sfx.pause()
        }
        this.wall.tilePositionX += 4;
        this.floor.tilePositionX += 4;

        // clock update
        this.timeRight.text = Math.ceil(this.clock.elapsed) / 1000;

        if(!this.gameOver) {
            this.p1Character.update();
            this.obstacle01.update(); 
            this.obstacle02.update();
            this.obstacle03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Character, this.obstacle03)) {
            // this.audio.play('sfx_death');
            // this.p1Character.reset();
            // this.characterExplode(this.obstacle03);
            this.gameOver = true;
        }
        if (this.checkCollision(this.p1Character, this.obstacle02)) {
            // this.audio.play('sfx_death');
            // this.p1Character.reset();
            // this.characterExplode(this.obstacle02);
            this.gameOver = true;
        }
        if (this.checkCollision(this.p1Character, this.obstacle01)) {
            // this.audio.play('sfx_death');
            // this.p1Character.reset();
            // this.characterExplode(this.obstacle01);
            this.gameOver = true;
        }

        // highScore
        // if (game.highScore <= this.p1Score) {
        //     game.highScore = this.p1Score
        //     this.hiScore.text = game.highScore
        // }
    }

    checkCollision(p1Character, obstacle03) {
        // simple AABB checking
        if (p1Character.x < obstacle03.x + obstacle03.width && p1Character.x + p1Character.width > obstacle03.x && p1Character.y < obstacle03.y + obstacle03.height && p1Character.height + p1Character.y > obstacle03.y) {
          return true;
        } else {
          return false;
        }
    }

    checkCollision(p1Character, obstacle02) {
        // simple AABB checking
        if (p1Character.x < obstacle02.x + obstacle02.width && p1Character.x + p1Character.width > obstacle02.x && p1Character.y < obstacle02.y + obstacle02.height && p1Character.height + p1Character.y > obstacle02.y) {
          return true;
        } else {
          return false;
        }
    }

    checkCollision(p1Character, obstacle01) {
        // simple AABB checking
        if (p1Character.x < obstacle01.x + obstacle01.width && p1Character.x + p1Character.width > obstacle01.x && p1Character.y < obstacle01.y + obstacle01.height && p1Character.height + p1Character.y > obstacle01.y) {
          return true;
        } else {
          return false;
        }
    }
    
    // characterExplode(ship) {
    //     console.log("hello")
    //     // temporarily hide ship
    //     character.alpha = 0;
    //     // create explosion sprite at ship's position
    //     let boom = this.add.sprite(character.x, character.y, 'explosion').setOrigin(0, 0);
    //     boom.anims.play('explode');
    //     boom.on('animationcomplete', () => {
    //         obstacle.reset();
    //         obstacle.alpha = 1;
    //         boom.destroy();
    //     });
//         // score add and repaint
//         this.p1Score += obstacle.points;
//         console.log(this.p1Score)
//         this.scoreLeft.text = this.p1Score;

//         // random explosion sounds
//         let random = Math.floor(Math.random() * 4) + 1
//         console.log(random)
//         switch (random)
//         {
//             case 1:
//                 this.sound.play('sfx_explosion1');
//                 break;
//             case 2:
//                 this.sound.play('sfx_explosion2');
//                 break;
//             case 3:
//                 this.sound.play('sfx_explosion3');
//                 break;
//             case 4:
//                 this.sound.play('sfx_explosion4');
//                 break;
//             default:
//                 break;
//         }
//     }
}


