import Phaser from "phaser";
import collidable from "../mixins/collidable";
import anims from "../mixins/anims";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.config = scene.config;

    // mixin
    Object.assign(this, collidable);
    // the target is "this" and the source is collidable. "this" will get the attributes of the collidable into its class
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.speed = 100;
    this.timeFromLastTurn = 0;
    this.maxPatrolDistance = 500;
    this.currentPatrolDistance = 0;

    this.health = 50;
    this.damage = 10;
    this.isDead = false;

    this.platformCollidersLayer = null;
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xaa00aa },
    });

    this.body.setGravityY(this.gravity);

    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);
    this.setImmovable(true);
    this.setVelocityX(this.speed);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    // when update is accessed in the Play scene, the Player scene will also be listening to updates to the sprite
  }

  update(time) {
    if (this.getBounds().bottom > 600) {
      this.scene.events.removeListener(
        Phaser.Scenes.Events.UPDATE,
        this.update,
        this
      );
      this.setActive(false);
      this.rayGraphics.clear();
      this.destroy();
      return;
    }
    // when the emeny dies (goes out of bounds from the world), it removes the event listener, sets it to nonactive (will no longer be updated)
    // clears the ray it casts, and finally destroys it
    this.patrol(time);
  }

  patrol(time) {
    if (!this.body || !this.body.onFloor()) {
      return;
    }

    this.currentPatrolDistance += Math.abs(this.body.deltaX());

    const { ray, hasHit } = this.raycast(
      this.body,
      this.platformCollidersLayer,
      {
        raylength: 35,
        precision: 1,
        steepness: 2,
      }
    );

    if (
      (!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeFromLastTurn + 100 < time
    ) {
      this.setFlipX(!this.flipX);
      this.setVelocityX((this.speed = -this.speed));
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }

    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  setPlatformColliders(platformCollidersLayer) {
    this.platformCollidersLayer = platformCollidersLayer;
  }

  deliversHit() {}

  takesHit(source) {
    source.deliversHit(this);
    this.health -= source.damage;

    if (this.health <= 0) {
      this.setTint(0xff0000);
      this.setVelocity(0, -200);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
      this.isDead = true;

      return this.scoreVal;
    }
    this.isDead = false;
  }
}

export default Enemy;
