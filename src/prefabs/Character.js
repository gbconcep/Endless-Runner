/*
Add Physics body to character
Enable gravity
Make sure character doesn't go below a certain height
Make sure character collides with obstacles
Set body velocity
*/

// Character prefab
class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
      scene.physics.add.existing(this);
      scene.add.existing(this);
      this.body.setSize(this.width * 0.7, this.height, true);
      this.body.setOffset(this.width * 0.15, 0);
      this.isJumping = false;
      this.isSliding = false;
      this.canJump = true;
      this.canSlide = true;
      this.moveSpeed = 10;
      this.setGravityY(800);
      this.body.allowGravity = false;
      this.sfxJump = scene.sound.add('sfx_jump');
      this.sfxVoice = scene.sound.add('sfx_voice');
      this.sfxRunning = scene.sound.add('sfx_running');
      this.anims.play('running');
      this.sfxRunning.play();
      this.sfxRunning.setLoop(true);
      this.ground = scene.ground;
      scene.physics.add.collider(this, scene.floor, scene.handleCollision, null, scene);
    }
  
    update() {
      // jump button
      if (Phaser.Input.Keyboard.JustDown(keyUP)) {
        if (!this.isJumping && !this.isSliding && this.canJump) {
          this.jump();
        }
      }
  
      // Check if character has landed on the "floor"
      if (!this.isJumping && !this.isSliding && this.body.velocity.y >= 0 && this.body.y >= game.config.height * 0.71) {
        this.land();
      }
  
      // slide button
      if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
        if (!this.isJumping && this.canSlide) {
          this.slide();
          // Set a timer to stop the slide animation after 1 second
          this.scene.time.delayedCall(1000, this.stopSlide, [], this);
        }
      }
  
      // Ensure character stays within the height limit
      this.enforceHeightLimit();
  
      if (this.isJumping) {
        this.anims.play('jump');
      } else if (this.isSliding) {
        this.anims.play('slide');
      } else {
        this.anims.play('running', true);
      }
    }
  
    enforceHeightLimit() {
      const targetY = game.config.height * 0.71;
      if (this.body.y > targetY) {
        this.body.y = targetY;
        if (this.isJumping) {
          this.land();
        }
      }
    }
  
    jump() {
      this.isJumping = true;
      this.anims.play('jump');
      this.sfxRunning.pause();
      this.setGravityY(800);
      this.sfxJump.play();
      this.sfxVoice.play();
      this.body.velocity.y = -450; // Adjust the jump velocity as needed
      this.body.allowGravity = true;
      this.canJump = false;
    }
  
    slide() {
      this.isSliding = true;
      this.anims.play('slide');
      this.sfxRunning.stop();
      this.body.allowGravity = false;
      this.canSlide = false;
      this.scene.ignoreCollision = true;
    }
  
    stopSlide() {
      this.isSliding = false;
      this.anims.play('running', true);
      this.sfxRunning.play();
      this.body.allowGravity = false;
      this.canSlide = true;
      this.scene.ignoreCollision = false;
    }
      
    handleCollision() {
        if (!this.isJumping && this.body.velocity.y >= 0 && !this.isSliding) {
          this.land();
        }
      }
      
      
    land() {
        this.isJumping = false;
        this.body.setVelocityY(0);
        const targetY = game.config.height * 0.71;
        if (this.body.y > targetY) {
          this.body.y = targetY;
        }
        this.body.allowGravity = false;
        this.canJump = true;
        this.anims.play('running', true);
        this.sfxRunning.play();
    }
      
    // reset character to initial state
    reset() {
      this.isJumping = false;
      this.x = game.config.height - borderUISize - borderPadding;
    }
  }
  
  
// class Character extends Phaser.Physics.Arcade.Sprite  {
//     constructor(scene, x, y, texture, frame) {
//         super(scene, x, y, texture, frame);
//         scene.physics.add.existing(this); 
//         scene.add.existing(this);
//         this.isJumping = false;
//         this.moveSpeed = 10;
//         this.setGravityY(50);
//         this.sfxJump = scene.sound.add('sfx_jump');
//         this.sfxVoice = scene.sound.add('sfx_voice');
//         this.sfxRunning = scene.sound.add('sfx_running');
//         this.anims.play('running');
//         this.sfxRunning.play();
//         this.sfxRunning.setLoop(true);
//         this.sfxRunning.play()
//     }
    
//     update() {   
//         // jump button 
//         if(Phaser.Input.Keyboard.JustDown(keyUP)) {
//             //this.y -= 50;
//             this.isJumping = true
//             this.sfxRunning.pause();
//             this.anims.play('jump');
//             this.body.velocity = new Phaser.Math.Vector2(0, -110)
//             this.setGravityY(100)
//             this.sfxJump.play();
//             this.sfxVoice.play();
//         }

//         if (this.y > [game.config.height*0.71]) {
//             this.isJumping = false
//         }

//         if (this.y == [game.config.height*0.71]) {
//             this.anims.play('running');
//             this.sfxRunning.play()
//  }

//         // slide button
//         if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
//             // && this.y == [game.config.height*0.71]
//             this.anims.play('slide');
//             this.sfxRunning.stop();
//             this.setGravityY(50)
//         }
        
//         // reset on miss
//         if(this.y > game.config.height*0.71) {
//             this.y = game.config.height*0.71;
//         }
//     }

//     // reset rocket to "ground"
//     reset() {
//         this.isJumping = false;
//         this.x = game.config.height - borderUISize - borderPadding;
//     }
// }

// class Character extends Phaser.Physics.Arcade.Sprite {
//     constructor(scene, x, y, texture, frame) {
//       super(scene, x, y, texture, frame);
//       scene.physics.add.existing(this);
//       scene.add.existing(this);
//       this.isJumping = false;
//       this.isSliding = false;
//       this.canSlide = true;
//       this.moveSpeed = 10;
//       this.setGravityY(800);
//       this.body.allowGravity = false;
//       this.sfxJump = scene.sound.add('sfx_jump');
//       this.sfxVoice = scene.sound.add('sfx_voice');
//       this.sfxRunning = scene.sound.add('sfx_running');
//       this.anims.play('running');
//       this.sfxRunning.play();
//       this.sfxRunning.setLoop(true);
//     }
  
//     update() {
//       // jump button
//       if (Phaser.Input.Keyboard.JustDown(keyUP)) {
//         if (!this.isJumping && !this.isSliding) {
//           this.jump();
//         }
//       }
  
//       if (this.isJumping && this.body.velocity.y >= 0) {
//         this.anims.play('jump');
//       } else if (!this.isJumping && !this.isSliding && this.anims.currentAnim.key !== 'slide') {
//         this.anims.play('running');
//       }
  
//       // slide button
//       if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
//         if (!this.isJumping && this.canSlide) {
//           this.slide();
//           // Set a timer to stop the slide animation after 1 second
//           this.scene.time.delayedCall(1000, this.stopSlide, [], this);
//         }
//       }
//     }
  
//     jump() {
//       this.isJumping = true;
//       this.anims.play('jump');
//       this.sfxRunning.pause();
//       this.setGravityY(800);
//       this.sfxJump.play();
//       this.sfxVoice.play();
//       this.body.velocity.y = -350; // Adjust the jump velocity as needed
//       this.body.allowGravity = true;
//     }
  
//     slide() {
//       this.isSliding = true;
//       this.anims.play('slide');
//       this.sfxRunning.stop();
//       this.body.allowGravity = false;
//       this.canSlide = false;
//     }
  
//     stopSlide() {
//       this.isSliding = false;
//       this.anims.play('running');
//       this.sfxRunning.play();
//       this.body.allowGravity = false;
//       this.canSlide = true;
//     }
  
//     // reset character to initial state
//     reset() {
//       this.isJumping = false;
//       this.x = game.config.height - borderUISize - borderPadding;
//     }
//   }
  