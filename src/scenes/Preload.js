import Phaser from "phaser";

class Preload extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.tilemapTiledJSON("level_1", "assets/lvl_1.json");
    this.load.tilemapTiledJSON("level_2", "assets/lvl_2.json");
    this.load.tilemapTiledJSON("level_3", "assets/lvl_3.json");
    this.load.tilemapTiledJSON("level_4", "assets/lvl_4.json");
    this.load.tilemapTiledJSON("level_5", "assets/lvl_5.json");

    this.load.image("tiles-1", "assets/main_lev_build_1.png");
    this.load.image("tiles-2", "assets/main_lev_build_2.png");
    this.load.image("tiles-3", "assets/grassy_tileset.png");
    this.load.image("tiles-4", "assets/night_tileset.png");
    this.load.image("bg-spikes-tileset", "assets/bg_spikes_tileset.png");

    this.load.image("bg-spikes-dark", "assets/bg_spikes_dark.png");
    this.load.image("sky-play", "assets/sky_play.png");

    this.load.image("menu-bg", "assets/background01.png");
    this.load.image("back", "assets/back.png");

    this.load.image("iceball-1", "assets/weapons/iceball_001.png");
    this.load.image("iceball-2", "assets/weapons/iceball_002.png");

    this.load.image("fireball-1", "assets/weapons/improved_fireball_001.png");
    this.load.image("fireball-2", "assets/weapons/improved_fireball_002.png");
    this.load.image("fireball-3", "assets/weapons/improved_fireball_003.png");

    this.load.image("diamond", "assets/collectibles/diamond.png");

    this.load.image("diamond-1", "assets/collectibles/diamond_big_01.png");
    this.load.image("diamond-2", "assets/collectibles/diamond_big_02.png");
    this.load.image("diamond-3", "assets/collectibles/diamond_big_03.png");
    this.load.image("diamond-4", "assets/collectibles/diamond_big_04.png");
    this.load.image("diamond-5", "assets/collectibles/diamond_big_05.png");
    this.load.image("diamond-6", "assets/collectibles/diamond_big_06.png");

    this.load.spritesheet("player", "assets/player/hero.png", {
      frameWidth: 50,
      frameHeight: 37,
    });

    this.load.spritesheet("player-run", "assets/player/hero_run.png", {
      frameWidth: 50,
      frameHeight: 37,
    });

    this.load.spritesheet("player-throw", "assets/player/hero_combat.png", {
      frameWidth: 50,
      frameHeight: 37,
    });

    this.load.spritesheet("birdman", "assets/enemy/enemy_sheet.png", {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    });

    this.load.spritesheet("snaky", "assets/enemy/enemy_sheet_2.png", {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    });

    this.load.spritesheet("slime", "assets/enemy/Slime_Spiked_Full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("skele", "assets/enemy/skeleton.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("hit-sheet", "assets/weapons/hit_effect_sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // sword attack effect
    this.load.spritesheet("sword-default", "assets/weapons/sword_sheet_1.png", {
      frameWidth: 52,
      frameHeight: 32,
      spacing: 16,
    });

    this.load.audio("theme", "assets/music/theme_music.wav");
    this.load.audio("projectile-launch", "assets/music/projectile_launch.wav");
    this.load.audio("running", "assets/music/step.wav");
    this.load.audio("jump", "assets/music/jump.wav");
    this.load.audio("swipe", "assets/music/swipe.wav");
    this.load.audio("coin-pickup", "assets/music/coin_pickup.wav");

    this.load.once("complete", () => {
      this.startGame();
    });
    // when all the assets are loaded, the complete keyword will fire
    // then we can start the game
  }

  startGame() {
    this.registry.set("level", 1); //sets the start level to level 1
    this.registry.set("unlocked-levels", 1);
    this.scene.start("MenuScene");
  }
}

export default Preload;
