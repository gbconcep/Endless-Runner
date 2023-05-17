class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spikes', './assets/spikes.png');
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
        this.deathScream = this.sound.add('sfx_death', {
            volume: 0.5
        });
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
            frames: this.anims.generateFrameNames('character', {prefix: 'Character Sprite ', start: 10, end: 10,}),
        frameRate: 9,
        repeat: -1
        });
        // dying animation
        this.anims.create({
            key: 'dying',
            frames: [{ key: 'character', frame: 'Character Sprite 9' }],
            frameRate: 1, 
            repeat: 0, 
          });
        // character
        this.p1Character = new Character(this, game.config.width/6, game.config.height*0.71, 'character', 0, this.time).setOrigin(0.5, 0); 
        this.physics.add.collider(this.p1Character, this.floor);
        // obstacles
        this.obstacleSpacing = game.config.width / 3; 
        this.obstacleMoveSpeed = game.settings.obstacleSpeed;
        this.obstacleTypes = ['rocket', 'spikes', 'box'];
        Phaser.Utils.Array.Shuffle(this.obstacleTypes);
        this.obstacleXPositions = [
        game.config.width + this.obstacleSpacing * 2,
        game.config.width + this.obstacleSpacing,
        game.config.width
        ];
        this.obstacles = [];

        for (let i = 0; i < this.obstacleTypes.length; i++) {
        const obstacleYPosition = getObstacleYPosition.call(this, this.obstacleTypes[i]);

        const obstacle = new Obstacles(
            this,
            this.obstacleXPositions[i],
            obstacleYPosition,
            this.obstacleTypes[i],
            0,
            getRandomPointValue.call(this)
        ).setOrigin(0, 0);
        obstacle.moveSpeed = this.obstacleMoveSpeed;
        this.obstacles.push(obstacle);
        }

        function getRandomYPosition() {
        return Phaser.Math.Between(game.config.height * 0.2, game.config.height * 0.8);
        }

        // randomize obstacles
        function getObstacleYPosition(obstacleType) {
        switch (obstacleType) {
            case 'rocket':
            return this.game.config.height * 0.72;
            case 'spikes':
            return this.game.config.height * 0.03;
            case 'box':
            return this.game.config.height * 0.73;
            default:
            return 0;
        }
        }

        function getRandomPointValue() {
        return Phaser.Math.Between(0, 50);
        }
        // border
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.width - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initiate score
        this.p1Score = 0;

        // display score
        this.scoreConfig = {
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
        this.scoreConfig.fixedWidth = 0

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
      };
      
      this.startTime = this.time.now; 
      
      this.timerText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, 'Time: 0.00', timeConfig);
      
      

        // how to play
        this.add.text(game.config.width/2.4, game.config.height/6.5, 'Press UP key to jump', this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.3, game.config.height/6.5, 'Press DOWN key to slide', this.scoreConfig).setOrigin(0.5);
        
        // high score display
        // this.add.text(250, 420, 'HIGH SCORE:').setOrigin(0, 0);
        // this.hiScore = this.add.text(400, 420, game.highScore);
        // let spikesGroup;
        // spikesGroup = this.physics.add.group();
    }

    update() {
        // this.p1Character.update();
        // slide button
    //     if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
    //       if (!this.p1Character.isJumping) {
    //         this.p1Character.slide();
    //         this.p1Character = this, game.config.width/6, game.config.height*0.81, 'character', 0;
    //         // Rest of the code...
        
    //         // Disable collision with 'spikes' and 'rocket' obstacles during the slide animation
    //         this.physics.world.colliders.getActive().forEach((collider) => {
    //             const isSpikeCollision =
    //                 (collider.bodyA === this.p1Character.body && spikesGroup.getChildren().includes(collider.bodyB.gameObject)) ||
    //                 (collider.bodyB === this.p1Character.body && spikesGroup.getChildren().includes(collider.bodyA.gameObject));
        
    //             const isRocketCollision =
    //                 (collider.bodyA === this.p1Character.body && rocketGroup.getChildren().includes(collider.bodyB.gameObject)) ||
    //                 (collider.bodyB === this.p1Character.body && rocketGroup.getChildren().includes(collider.bodyA.gameObject));
        
    //             if (isSpikeCollision || isRocketCollision) {
    //                 collider.active = false;
    //             }
    //         });
        
    //         // Move the character sprite back to its original position during the slide
    //         this.p1Character.setOrigin(0.5, 1); // Adjust the origin as per your sprite
    //     }
    //   }
      
    //   if (this.p1Character.isSliding) {
    //     this.p1Character.setOrigin(0.5, 0.5); // Reset the origin to its default position
    // }          

        this.time.delayedCall(30000, () => {
            console.log('call')
            this.obstacles.forEach((obstacle) => {
                obstacle.moveSpeed *= 2;
              });
            // this.obstacle01.moveSpeed*2
            // this.obstacle02.moveSpeed*2
            // this.obstacle03.moveSpeed*2
        })
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
            console.log('reset')
            this.sfx.stop()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            this.sfx.stop()
        }


        // this.timeRight.text = Math.ceil(this.clock.elapsed) / 1000;

        if (!this.gameOver) {
          let elapsedSeconds = (this.time.now - this.startTime) / 1000; 
          this.timerText.text = elapsedSeconds.toFixed(2);
          this.wall.tilePositionX += 4;
          this.floor.tilePositionX += 4;
          this.p1Character.update();
          this.obstacles.forEach((obstacle) => {
            obstacle.update();
            if (this.checkCollision(this.p1Character, obstacle)) {
              this.death()
              this.menuScreen()
            }
          });
        }
    }

    death() {
        this.p1Character.sfxRunning.stop();
        this.p1Character.anims.stop(); 
        this.p1Character.anims.play('dying');
        this.sound.play('sfx_death');
        this.p1Character.setGravityY(0);
        this.p1Character.body.velocity = new Phaser.Math.Vector2(0, 0);
    }
    

    menuScreen() {
        this.add.text(game.config.width/1.9, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.9, game.config.height/2 + 64, 'PRESS SPACE to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }

    checkCollision(p1Character, obstacle) {
      // Ignore collision with spikes and rockets during slide animation
      if (p1Character.isSliding && (obstacle.texture.key === 'spikes' || obstacle.texture.key === 'rocket')) {
        return false;
      }
    
      // Simple AABB checking
      if (
        p1Character.x < obstacle.x + obstacle.width &&
        p1Character.x + p1Character.width > obstacle.x &&
        p1Character.y < obstacle.y + obstacle.height &&
        p1Character.y + p1Character.height > obstacle.y
      ) {
        // Collision detected
        return true;
      } else {
        return false;
      }
    }
    
    
    characterExplode(obstacle) {
        console.log("hello")
        // temporarily hide ship
        p1Character.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(p1Character.x, p1Character.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            obstacle.reset();
            obstacle.alpha = 1;
            boom.destroy();
        });
    }
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


