export default (anims) => {
    anims.create({
      key: "slime-idle",
      frames: anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  
    anims.create({
      key: "slime-jump",
      frames: anims.generateFrameNumbers("slime", { start: 9, end: 14 }),
      frameRate: 6,
      repeat: 0,
    });
  
    anims.create({
      key: "slime-hurt",
      frames: anims.generateFrameNumbers("slime", { start: 20, end: 21 }),
      frameRate: 5,
      repeat: 0,
    });
  };
  