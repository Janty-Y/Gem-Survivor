import Phaser from "phaser";
import HealthBar from "../hud/HealthBar";
import initAnimations from "./anims/playerAnims";
import collidable from "../mixins/collidable";
import anims from "../mixins/anims";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";
import { getTimestamp } from "../utils/functions";
import EventEmitter from "../events/Emitter";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    this.setScale(1.5);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixin
    Object.assign(this, collidable);
    Object.assign(this, anims);

    // the target is "this" and the source is collidable. "this" will get the attributes of the collidable into its class

    this.init();
    this.initEvents();
  }

  init() {
    this.height = 50;
    this.gravity = 500;
    this.playerSpeed = 150;
    this.jumpCount = 0;
    this.consecutiveJumps = 1;
    this.hasBeenHit = false;
    this.isSliding = false;
    this.bounceVelocity = 250; // strength of the hit
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.jumpSound = this.scene.sound.add("jump", { volume: 0.2 });
    this.projectileSound = this.scene.sound.add("projectile-launch", {
      volume: 0.2,
    });
    this.runningSound = this.scene.sound.add("running", { volume: 0.2 });
    this.swipeSound = this.scene.sound.add("swipe", { volume: 0.2 });

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.projectiles = new Projectiles(this.scene, "iceball-1");
    this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");
    this.timeFromLastSwing = null;

    this.health = 50;
    this.hp = new HealthBar(
      this.scene,
      this.scene.config.leftTopCorner.x + 5,
      this.scene.config.leftTopCorner.y + 5,
      2,
      this.health
    );

    this.body.setSize(20, 24);

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);

    initAnimations(this.scene.anims);

    this.handleAttacks();
    this.handleMovements();

    this.scene.time.addEvent({
      delay: 400,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.isPlayingAnims("run")) {
          this.runningSound.play();
        }
      },
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    // when update is accessed in the Play scene, the Player scene will also be listening to updates to the sprite
  }

  update() {
    if (this.hasBeenHit || this.isSliding || !this.body) {
      return;
    }

    if (this.getBounds().top > this.scene.config.height) {
      EventEmitter.emit("PLAYER_LOSE");
    }
    // player loses if they fall off the world

    const { left, right, space } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

    const onFloor = this.body.onFloor();

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (
      isSpaceJustDown &&
      (onFloor || this.jumpCount < this.consecutiveJumps)
    ) {
      this.jumpSound.play();
      this.setVelocityY(-this.playerSpeed * 2);
      this.jumpCount++;
    }

    if (onFloor) {
      this.jumpCount = 0;
    }

    if (this.isPlayingAnims("throw") || this.isPlayingAnims("slide")) {
      return;
    }
    // needed to show attack animation - will return rather than overriding with the following animations

    onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
    //if we are on the floor (onFloor = true), go into the next check, which checks the velocity of the player
    //otherwise, 'jump' animation plays
  }

  handleAttacks() {
    this.scene.input.keyboard.on("keydown-Q", () => {
      this.projectileSound.play();
      this.play("throw", true);
      this.projectiles.fireProjectile(this, "iceball");
    });

    this.scene.input.keyboard.on("keydown-E", () => {
      if (
        this.timeFromLastSwing &&
        this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()
      ) {
        return;
      }

      this.swipeSound.play();
      this.play("throw", true);
      this.meleeWeapon.swing(this);
      this.timeFromLastSwing = getTimestamp();
    });
  }

  handleMovements() {
    this.scene.input.keyboard.on("keydown-DOWN", () => {
      this.body.setSize(this.width / 2, this.height / 2);
      this.setOffset(10, this.height / 2);
      this.isSliding = true;
      this.play("slide", true);
      this.setVelocity(0, 0);
    });

    this.scene.input.keyboard.on("keyup-DOWN", () => {
      this.body.setSize(20, 27);
      this.setVelocityX(0);

      this.body.height = 50;
      this.isSliding = false;
    });
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,

      repeat: -1,
      tint: 0xffffff,
    });
  }

  bounceOff(source) {
    if (source.body) {
      this.body.touching.right
        ? this.setVelocityX(-this.bounceVelocity * 0.5, -this.bounceVelocity)
        : this.setVelocityX(this.bounceVelocity * 0.5, -this.bounceVelocity);
    } else {
      this.body.blocked.right
        ? this.setVelocityX(-this.bounceVelocity * 0.5, -this.bounceVelocity)
        : this.setVelocityX(this.bounceVelocity * 0.5, -this.bounceVelocity);
    }

    setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
  }

  takesHit(source) {
    if (this.hasBeenHit) {
      return;
    }

    this.health -= source.damage || source.properties.damage || 0;
    if (this.health <= 0) {
      EventEmitter.emit("PLAYER_LOSE");
      return;
    }

    this.hasBeenHit = true;
    this.bounceOff(source);
    const hitAnmin = this.playDamageTween();
    this.hp.decrease(this.health);

    source.deliversHit && source.deliversHit(this);

    this.scene.time.delayedCall(1000, () => {
      (this.hasBeenHit = false), hitAnmin.stop();
      this.clearTint();
    });
  }
}

export default Player;
