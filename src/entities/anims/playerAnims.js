export default (anims) => {
    anims.create({
      key: "idle",
      frames: anims.generateFrameNumbers("player", { start: 38, end: 41 }),
      frameRate: 5,
      repeat: -1,
    });
  
    anims.create({
      key: "run",
      frames: anims.generateFrameNumbers("player-run", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
  
    anims.create({
      key: "jump",
      frames: anims.generateFrameNumbers("player", { start: 16, end: 23 }),
      frameRate: 5,
      repeat: -1,
    });
  
    anims.create({
      key: "throw",
      frames: anims.generateFrameNumbers("player-throw", { start: 8, end: 13 }),
      frameRate: 14,
      repeat: 0,
    });
  
    anims.create({
      key: "slide",
      frames: anims.generateFrameNumbers("player", { start: 24, end: 27 }),
      frameRate: 20,
      repeat: 0,
    });
  };
  