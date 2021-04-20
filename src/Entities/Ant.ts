import * as Phaser from "phaser";
import FindPath from "../Helpers/Pathfind";
import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";

export default class Ant extends BaseEntity {

    private dir = 1;
    private steps = 10;

    private itemHolding: BaseEntity = null;
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        super("Ant", 0x822a3e, true, true, false, width, height, x, y, gameScene, world);
    }

    run() {
        super.run();

        if(this.isGrounded) {
            FindPath(this.world, this.x, this.y, 90, 40, true, false, false);
        }
    }
}