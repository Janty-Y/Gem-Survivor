import BaseScene from "./BaseScene";

class ControlScene extends BaseScene {
  constructor(config) {
    super("ControlScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();

    this.menu = [
      { scene: null, text: "Melee: E" },
      { scene: null, text: "Projectile: Q" },
      { scene: null, text: "Jump: Spacebar" },
      { scene: null, text: "Movement: Arrow Keys" },
    ];

    this.createMenu(this.menu, () => {});
  }
}

export default ControlScene;
