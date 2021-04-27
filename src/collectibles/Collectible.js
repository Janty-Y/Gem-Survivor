import Phaser from "phaser";

class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);

    this.score = 1;

    this.setOrigin(0, 1);

    scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: Phaser.Math.Between(1500, 2500),
      repeat: -1,
      easy: "linear",
      yoyo: true,
    });
  }
}

export default Collectible;
