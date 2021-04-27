import Phaser from "phaser";
import Collectible from "../collectibles/Collectible";

class Collectibles extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createFromConfig({
      classType: Collectible,
    });
  }

  mapProperties(propertiesList) {
    if (!propertiesList || propertiesList.length === 0) {
      return {};
    }
    //returns an empty object if there are no properties

    return propertiesList.reduce((map, obj) => {
      map[obj.name] = obj.value;
      return map;
    }, {});
  }

  addFromLayer(layer) {
    const { score: defaultScore, type } = this.mapProperties(layer.properties);

    layer.objects.forEach((collectibleO) => {
      const collectible = this.get(collectibleO.x, collectibleO.y, type);
      const props = this.mapProperties(collectibleO.properties);

      collectible.score = props.score || defaultScore;
      // will use the default score assigned to the layer in Tiled if there is no specific value assigned to a given collectible
    });
  }
}

export default Collectibles;
