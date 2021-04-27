import Phaser from "phaser";

let totalScore = 0;

class Hud extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);

    const { rightTopCorner } = scene.config;
    this.containerWidth = 70;
    this.setPosition(
      rightTopCorner.x - this.containerWidth - 30,
      rightTopCorner.y + 10
    );
    this.setScrollFactor(0);
    this.setDepth(99);
    this.fontSize = 16;
    this.setupList();
    this.updateScoreBoard(totalScore);
  }

  setupList() {
    const scoreBoard = this.createScoreBoard();
    this.add([scoreBoard]);
    let lineHeight = 0;
    this.list.forEach((item) => {
      item.setPosition(item.x, item.y + lineHeight);
      lineHeight += 20;
    });
  }

  createScoreBoard() {
    const scoreText = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });
    const scoreImage = this.scene.add
      .image(scoreText.width + 5, 0, "diamond")
      .setScale(1.3)
      .setOrigin(0);

    let bestHolder = null;

    if (localStorage.getItem("bestScore") === null) {
      bestHolder = 0;
    } else {
      bestHolder = localStorage.getItem("bestScore");
    }

    const best = this.scene.add.text(0, 20, `Best: ${bestHolder}`, {
      fontSize: "14px",
      fill: "#fff",
    });

    const scoreBoard = this.scene.add.container(0, 0, [
      scoreText,
      scoreImage,
      best,
    ]);
    scoreBoard.setName("scoreBoard");

    return scoreBoard;
  }

  updateScoreBoard(score) {
    const [scoreText, scoreImage] = this.getByName("scoreBoard").list;
    scoreText.setText(score);
    scoreImage.setX(scoreText.width + 5);
  }

  setCurrentScore(score) {
    totalScore = score;
  }

  getCurrentScore() {
    return totalScore;
  }
}

export default Hud;
