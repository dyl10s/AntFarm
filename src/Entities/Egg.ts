import MainScene from "../Scenes/MainScene";
import Ant from "./Ant";
import BaseEntity from "./BaseEntity";

export default class Egg extends BaseEntity {

    private static HATCH_TIME = 100;
    private hatchTimer = 0;

    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        super("Egg", 0xe3d6b3, true, true, true, width, height, x, y, gameScene, world);
    }

    run() {

        this.hatchTimer += 1;

        if(this.hatchTimer > Egg.HATCH_TIME) {
            this.removeItem();
            this.world[this.x][this.y] = new Ant(this.width, this.height, this.x, this.y, this.scene, this.world);
        }

        super.run();
    }
}