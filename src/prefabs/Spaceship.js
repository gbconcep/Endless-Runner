// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.reset();
    }

    update() {
        // randomize spaceship direction
        if (this.direction == 1) {
            this.x -= this.moveSpeed;
        }
        if (this.direction == 2) {
            this.x += this.moveSpeed;
        }
        
        // wrap around from left edge to right edge
        if((this.x <= 0 - this.width && this.direction == 1) || (this.x >= game.config.width + this.width && this.direction == 2)) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.direction = Math.floor(Math.random() * 2) + 1
        console.log(this.direction)
        if (this.direction == 1) {
            this.flipX = false
            this.x = game.config.width;
        }
        if (this.direction == 2) {
            this.flipX = true
            this.x = 0;
        }
    }
}