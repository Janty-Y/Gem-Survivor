import Phaser from "phaser";
import Player from "../entities/Player";
import Enemies from "../groups/Enemies";
import initAnims from "../anims";
import Collectibles from "../groups/Collectibles";
import Hud from "../hud";
import EventEmitter from "../events/Emitter";

class Play extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }

  create({ gameStatus }) {
    this.hud = new Hud(this, 0, 0);
    this.score = this.hud.getCurrentScore();

    this.playBGMusic();
    this.collectSound = this.sound.add("coin-pickup", { volume: 0.2 });

    const map = this.createMap();
    initAnims(this.anims);

    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);
    const enemies = this.createEnemies(
      layers.enemySpawns,
      layers.platformColliders
    );
    const collectibles = this.createCollectibles(layers.collectibles);

    this.createEnemyColliders(enemies, {
      colliders: {
        platformColliders: layers.platformColliders,
        player,
      },
    });

    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layers.platformColliders,
        projectiles: enemies.getProjectiles(),
        collectibles,
        traps: layers.traps,
      },
    });

    this.createBG(map);
    this.createBackButton();
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    if (gameStatus === "PLAYER_LOSE") {
      this.hud.setCurrentScore(0);
      return;
    }

    this.createGameEvents();
  }

  playBGMusic() {
    if (this.sound.get("theme")) {
      return;
    } // if theme music is already playing, return
    // this.sound.add('theme', {loop: true, volume: 0.02}).play();
  }

  createMap() {
    const map = this.make.tilemap({ key: `level_${this.getCurrentLevel()}` });
    map.addTilesetImage("main_lev_build_1", "tiles-1");
    map.addTilesetImage("main_lev_build_2", "tiles-2");
    map.addTilesetImage("grassy_tileset", "tiles-3");
    map.addTilesetImage("night_tileset", "tiles-4");
    map.addTilesetImage("bg_spikes_tileset", "bg-spikes-tileset");
    return map;
  }

  createLayers(map) {
    const tileset1 = map.getTileset("main_lev_build_1");
    const tileset2 = map.getTileset("main_lev_build_2");
    const tileset3 = map.getTileset("grassy_tileset");
    const tileset4 = map.getTileset("night_tileset");
    const tilesetBg = map.getTileset("bg_spikes_tileset");

    map.createStaticLayer("distance", tilesetBg).setDepth(-12);

    const platformColliders = map
      .createStaticLayer("Platform_Colliders", tileset1)
      .setAlpha(0);
    const environment = map
      .createStaticLayer("Environment", [
        tileset1,
        tileset2,
        tileset3,
        tileset4,
      ])
      .setDepth(-2);
    const platforms = map.createStaticLayer("Platforms", [
      tileset1,
      tileset2,
      tileset3,
      tileset4,
    ]);
    const playerZones = map.getObjectLayer("player_zones");
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    const collectibles = map.getObjectLayer("collectibles");
    const traps = map.createStaticLayer("traps", tileset1);

    platformColliders.setCollisionByExclusion(-1, true);
    traps.setCollisionByExclusion(-1);

    return {
      environment,
      platforms,
      platformColliders,
      playerZones,
      enemySpawns,
      collectibles,
      traps,
    };

    //if more than one tile set is used, put them in an array ex: [tileset1, tileset2]
  }

  createBG(map) {
    const bgObj = map.getObjectLayer("distance_bg").objects[0];

    this.spikesImage = this.add
      .tileSprite(
        bgObj.x,
        bgObj.y,
        this.config.width,
        bgObj.height,
        "bg-spikes-dark"
      )
      .setOrigin(0, 1)
      .setDepth(-10)
      .setAlpha(1)
      .setScrollFactor(0, 1);

    this.skyImage = this.add
      .tileSprite(0, 0, this.config.width, 180, "sky-play")
      .setOrigin(0, 0)
      .setDepth(-11)
      .setScale(2)
      .setAlpha(1)
      .setScrollFactor(0, 1);
  }

  createBackButton() {
    const backBtn = this.add
      .image(
        this.config.rightBottomCorner.x,
        this.config.rightBottomCorner.y,
        "back"
      )
      .setOrigin(1)
      .setScrollFactor(0)
      .setScale(2)
      .setInteractive();

    backBtn.on("pointerup", () => {
      this.hud.setCurrentScore(0);
      this.scene.start("MenuScene");
    });
  }

  createGameEvents() {
    EventEmitter.on("PLAYER_LOSE", () => {
      this.scene.restart({ gameStatus: "PLAYER_LOSE" });
    });
  }

  createCollectibles(collectibleLayer) {
    const collectibles = new Collectibles(this).setDepth(-1);

    collectibles.addFromLayer(collectibleLayer);
    collectibles.playAnimation("diamond-shine");

    return collectibles;
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer, platformColliders) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach((spawnPoint, i) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemy.setPlatformColliders(platformColliders);
      enemies.add(enemy);
    });

    return enemies;
  }

  onPlayerCollision(enemy, player) {
    player.takesHit(enemy);
  }

  onHit(entity, source) {
    this.isDead = false;
    entity.takesHit(source);
    if (entity.isDead) {
      this.scene.score += 5;
      this.scene.hud.updateScoreBoard(this.scene.score);
    }
  }

  onCollect(entity, collectible) {
    this.score += collectible.score;
    this.hud.updateScoreBoard(this.score);
    // 1st parameter = disableGameObject -> this will deactivate the object (default is false)
    // 2nd parameter = hideGameObject - > this will hide the game object (default is false)
    this.collectSound.play();
    collectible.disableBody(true, true);
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformColliders)
      .addCollider(colliders.player, this.onPlayerCollision)
      .addCollider(colliders.player.projectiles, this.onHit)
      .addOverlap(colliders.player.meleeWeapon, this.onHit);
  }

  createPlayerColliders(player, { colliders }) {
    player
      .addCollider(colliders.platformColliders)
      .addCollider(colliders.projectiles, this.onHit)
      .addCollider(colliders.traps, this.onHit)
      .addOverlap(colliders.skm, this.onHit)
      .addOverlap(colliders.collectibles, this.onCollect, this);
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    // the following is the bound for the world
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    // the following is the bound for the camera only
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find((zone) => zone.name === "startZone"),
      end: playerZones.find((zone) => zone.name === "endZone"),
    };
  }

  getCurrentLevel() {
    return this.registry.get("level") || 1;
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0) // makes zone obj invisible
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;

      if (this.registry.get("level") === this.config.lastLevel) {
        const yourScoreText = localStorage.getItem("yourScore");
        const yourScore = yourScoreText && parseInt(yourScoreText, 10);
        localStorage.setItem("yourScore", this.score);

        this.scene.start("CreditsScene");
        this.registry.set("level", 1);

        const bestScoreText = localStorage.getItem("bestScore");
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if (!bestScore || this.score > bestScore) {
          localStorage.setItem("bestScore", this.score);
        }

        this.hud.setCurrentScore(0);
        return;
      }

      this.hud.setCurrentScore(this.score);
      this.registry.inc("level", 1); // (key, increment)
      this.scene.restart({ gameStatus: " LEVEL_COMPLETETD" });
    });
  }

  update() {
    this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1;
    // creates a parallax effect - the BG image scrolls with the camera
  }
}

export default Play;
