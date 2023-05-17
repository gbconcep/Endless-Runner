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
      this.p1Character.body.debugShowBody = false; 
      this.p1Character.body.debugShowVelocity = false; 
      this.add.existing(this.p1Character);

    // obstacles
    this.obstacleSpacing = game.config.width / 3;
    this.obstacleMoveSpeed = game.settings.obstacleSpeed;
    this.obstacleTypes = ['rocket', 'spikes', 'box'];
    Phaser.Utils.Array.Shuffle(this.obstacleTypes);
    this.obstacleXPositions = [
      game.config.width + 400,
      game.config.width + 200,
      game.config.width
    ];
    this.obstacles = [];

    // Function to get the Y position for a given obstacle type
    function getObstacleYPosition(obstacleType) {
      switch (obstacleType) {
        case 'rocket':
          return game.config.height * 0.71;
        case 'spikes':
          return game.config.height * 0.01;
        case 'box':
          return game.config.height * 0.73;
        default:
          return 0;
      }
    }

    for (let i = 0; i < this.obstacleTypes.length; i++) {
      const obstacleYPosition = getObstacleYPosition(this.obstacleTypes[i]);

      const obstacle = new Obstacles(
        this,
        this.obstacleXPositions[i],
        obstacleYPosition,
        this.obstacleTypes[i],
        0,
        getRandomPointValue()
      ).setOrigin(0, 0);

      obstacle.moveSpeed = this.obstacleMoveSpeed;
      obstacle.body.debugShowBody = false;
      obstacle.body.debugShowVelocity = false;

      this.obstacles.push(obstacle);
    }

    // Function to create a new random obstacle
    function createRandomObstacle() {
      const randomIndex = Math.floor(Math.random() * this.obstacleTypes.length);
      const obstacleType = this.obstacleTypes[randomIndex];
      const obstacleYPosition = getObstacleYPosition(obstacleType);
      const obstacleXPosition = game.config.width + 400; // Adjust the starting position as needed

      const obstacle = new Obstacles(
        this,
        obstacleXPosition,
        obstacleYPosition,
        obstacleType,
        0,
        getRandomPointValue()
      ).setOrigin(0, 0);

      obstacle.moveSpeed = this.obstacleMoveSpeed;
      obstacle.body.debugShowBody = false;
      obstacle.body.debugShowVelocity = false;

      this.obstacles.push(obstacle);
    }

    // Call createRandomObstacle to add a new random obstacle
    createRandomObstacle.call(this);

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
    
    this.timerText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, '0.00', timeConfig);

      // how to play
      this.add.text(game.config.width/2.4, game.config.height/6.5, 'Press UP key to jump', this.scoreConfig).setOrigin(0.5);
      this.add.text(game.config.width/1.3, game.config.height/6.5, 'Press DOWN key to slide', this.scoreConfig).setOrigin(0.5);

      // Initialize variables
      this.currentTime = 0; // Track the current time
      this.bestTime = game.bestTime || 0; // Load the best time from game or set to 0

      // ...

      // Display the best time
      this.bestTimeText = this.add.text(250, 420, `BEST TIME: ${this.formatTime(this.bestTime)}`, {
          fontFamily: 'Courier',
          fontSize: '20px',
          color: '#ffffff'
      });
  }

  update() {     
      this.time.delayedCall(15000, () => {
          console.log('call')
          this.obstacles.forEach((obstacle) => {
              obstacle.moveSpeed *= 1.001;
            });
          // this.obstacle01.moveSpeed*2
          // this.obstacle02.moveSpeed*2
          // this.obstacle03.moveSpeed*2
      })
      // check key input for restart
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
          this.restart();
      }
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.scene.start("menuScene");
          this.sfx.stop()
      }

      // this.timeRight.text = Math.ceil(this.clock.elapsed) / 1000;

      if (!this.gameOver) {
        let elapsedSeconds = (this.time.now - this.startTime) / 1000; 
        this.currentTime = elapsedSeconds;
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

      // Update the best time if the current time is greater than the previous best time
      if (this.currentTime > this.bestTime) {
        this.bestTime = this.currentTime;
        this.bestTimeText.setText(`BEST TIME: ${this.formatTime(this.bestTime)}`);
        game.bestTime = this.bestTime; // Store the best time in game for persistence
    }
    
  }

  restart() {
    this.scene.restart();
    console.log('reset');
    this.sfx.stop();
    this.startTime = this.time.now; // Reset the start time
    this.currentTime = 0; // Reset the current time
    this.timerText.text = 'Time: 0.00'; // Update the timer display
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
    
    // Adjust the additionalWidth value to change the hitbox size
    const additionalWidthLeft = 35; // No change on the left side
    const additionalWidthRight = 0; // Decrease the hitbox width on the right side
  
    // Collision detection code
    if (
      p1Character.x < obstacle.x + obstacle.width + additionalWidthRight &&
      p1Character.x + p1Character.width > obstacle.x + additionalWidthLeft &&
      p1Character.y < obstacle.y + obstacle.height &&
      p1Character.y + p1Character.height > obstacle.y
    ) {
      // Collision detected
      return true;
    } else {
      return false;
    }
  }

  formatTime(time) {
    // Helper function to format the time as MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
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

