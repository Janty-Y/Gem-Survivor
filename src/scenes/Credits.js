import BaseScene from "./BaseScene";

class CreditsScene extends BaseScene {
  constructor(config) {
    super("CreditsScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    const yourScore = localStorage.getItem("yourScore");

    this.menu = [
      { scene: null, text: "All levels completed!" },
      { scene: null, text: "Thank you for playing!" },
      { scene: null, text: `Your score: ${yourScore}` },
    ];

    localStorage.setItem("yourScore", 0);
    this.createMenu(this.menu, () => {});
  }
}

export default CreditsScene;
