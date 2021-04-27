import Enemy from "./Enemy";
import initAnims from "./anims/slimeAnims";

class Slime extends Enemy {
  // this = the player object

  constructor(scene, x, y) {
    super(scene, x, y, "slime");
    initAnims(scene.anims);
  }

  init() {
    super.init();
    this.setSize(this.width / 3, this.height / 2 - 8);
    this.setOffset(20, 28);
    this.health = 20;
    this.timeFromLastAttack = 0;
    this.attackDelay = this.getAttackDelay();
    this.lastDirection = null;
    this.maxPatrolDistance = 200;
    this.speed = 20;
  }

  update(time, delta) {
    super.update(time, delta);

    if (!this.active) {
      return;
    }
    if (this.isPlayingAnims("slime-hurt")) {
      return;
    }

    if (this.body.onFloor()) {
      this.play("slime-idle", true);
    } else {
      this.play("slime-jump", true);
    }

    if (this.body.velocity.x > 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    } else {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    }

    if (this.health <= 0) {
      return;
    }
    if (this.timeFromLastAttack + this.attackDelay <= time) {
      this.jumpAttack();
      this.timeFromLastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }
  }

  getAttackDelay() {
    return Phaser.Math.Between(4000, 6000);
  }

  jumpAttack() {
    this.setVelocityY(-400);
  }

  takesHit(source) {
    super.takesHit(source);
    this.play("slime-hurt", true);
  }
}

export default Slime;
