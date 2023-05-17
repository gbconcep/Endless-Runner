// Obstacle prefab
class Obstacles extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.body.setSize(this.width * 0.5, this.height, true); // Adjust the x-axis hitbox size as needed
      this.body.setOffset(this.width * 0.10, 0); // Adjust the x-axis hitbox offset as needed
      this.moveSpeed = 0;
      this.pointValue = pointValue;
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}