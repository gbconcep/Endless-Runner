// Obstacle prefab
class Obstacles extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.body.setSize(this.width * 0.4, this.height, true);
      this.body.setOffset(this.width * 0.20, 0);
      this.moveSpeed = 0;
      this.pointValue = pointValue;
    }

    update() {
        // obstacles move left
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