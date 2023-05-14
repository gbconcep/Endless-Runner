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
        this.isFiring = false;
        this.moveSpeed = 4;
        this.setGravityY(50);
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        this.anims.play('running');
    }
    
    // let run = this.sprite.animations.add(
    //     'running',
    //     Phaser.Animation.generateFrameNames('Character Sprite ', 1, 3),
    //     true);
    // let jump = this.sprite.animations.add(
    //     'jump',
    //     Phaser.Animation.generateFrameNames('Character Sprite ', 4),
    //     true);
    // let slide = this.sprite.animations.add(
    //     'slide',
    //     Phaser.Animation.generateFrameNames('Character Sprite', 10),
    //     true);
    // }

    update() {   
        // jump button 
        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            //this.y -= 50;
            this.anims.play('jump');  
            this.body.velocity = new Phaser.Math.Vector2(0, -80)
            this.setGravityY(40)
        }

        if (this.y == [game.config.height*0.71]) {
            this.anims.play('running');
 }

        // slide button
        if(Phaser.Input.Keyboard.JustDown(keyDOWN) && this.y == [game.config.height*0.75]) {
            this.anims.play('slide');
            this.setGravityY(50)
        }
        // if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
        //     this.y      
        // }

        // // fire button
        // if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
        //     this.isFiring = true;
        //     this.sfxRocket.play(); // play sfx
        // }

        // reset on miss
        if(this.y > game.config.height*0.71) {
            this.y = game.config.height*0.71;
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.x = game.config.height - borderUISize - borderPadding;
    }
}