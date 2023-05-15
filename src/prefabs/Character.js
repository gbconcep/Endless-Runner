/*
Add Physics body to character
Enable gravity
Make sure character doesn't go below a certain height
Make sure character collides with obstacles
Set body velocity
*/

// Rocket prefab
class Character extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.add.existing(this); 
        scene.add.existing(this);
        this.isJumping = false;
        this.moveSpeed = 10;
        this.setGravityY(50);
        this.sfxJump = scene.sound.add('sfx_jump');
        this.sfxVoice = scene.sound.add('sfx_voice');
        this.sfxRunning = scene.sound.add('sfx_running');
        this.anims.play('running');
        this.sfxRunning.play();
        this.sfxRunning.setLoop(true);
        this.sfxRunning.play()
    }
    
    update() {   
        // jump button 
        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            //this.y -= 50;
            this.isJumping = true
            this.sfxRunning.pause();
            this.anims.play('jump');
            this.body.velocity = new Phaser.Math.Vector2(0, -110)
            this.setGravityY(100)
            this.sfxJump.play();
            this.sfxVoice.play();
        }

        if (this.y > [game.config.height*0.71]) {
            this.isJumping = false
        }

        if (this.y == [game.config.height*0.71]) {
            this.anims.play('running');
            this.sfxRunning.play()
 }

        // slide button
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            // && this.y == [game.config.height*0.71]
            this.anims.play('slide');
            this.setGravityY(50)
        }
        
        // reset on miss
        if(this.y > game.config.height*0.71) {
            this.y = game.config.height*0.71;
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isJumping = false;
        this.x = game.config.height - borderUISize - borderPadding;
    }
}