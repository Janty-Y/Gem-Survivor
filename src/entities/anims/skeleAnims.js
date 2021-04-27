export default (anims) => {
    anims.create({
      key: "skele-idle",
      frames: anims.generateFrameNumbers("skele", { start: 26, end: 37 }),
      frameRate: 8,
      repeat: -1,
    });
  
    anims.create({
      key: "skele-hurt",
      frames: anims.generateFrameNumbers("skele", { start: 13, end: 14 }),
      frameRate: 5,
      repeat: 0,
    });
  
    anims.create({
      key: "skele-swing",
      frames: anims.generateFrameNumbers("skele", { start: 3, end: 11 }),
      frameRate: 12,
      repeat: 0,
    });
  };
  