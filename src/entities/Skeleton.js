import Enemy from "./Enemy";
import initAnims from "./anims/skeleAnims";

class Skeleton extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "skele");
    initAnims(scene.anims);
    this.play("skele-idle", true);
  }

  init() {
    super.init();
    this.setSize(this.width / 3, this.height / 2);
    this.setOffset(20, 15);
    this.health = 70;
    this.timeFromLastAttack = 0;
    this.attackDelay = this.getAttackDelay();
    this.lastDirection = null;
    this.maxPatrolDistance = 300;
    this.speed = 60;
    this.setScale(1.3);
  }

  update(time, delta) {
    super.update(time, delta);

    if (!this.active) {
      return;
    }
    if (this.isPlayingAnims("skele-hurt")) {
      return;
    }
    if (this.health <= 0) {
      return;
    }

    if (this.body.onFloor()) {
      this.play("skele-idle", true);
      this.setSize(this.width / 3, this.height / 2);
    } else {
      this.play("skele-swing", true);
      this.body.setSize(this.width / 1.5, this.height / 2);
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
      this.handleAttack();
      this.setVelocityX(this.speed);
      this.timeFromLastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }
  }

  handleAttack() {
    this.setVelocityY(-350);
  }

  getAttackDelay() {
    return Phaser.Math.Between(3000, 6000);
  }

  takesHit(source) {
    super.takesHit(source);
    this.play("skele-hurt", true);
  }
}

export default Skeleton;
