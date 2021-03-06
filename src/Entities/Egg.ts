import MainScene from "../Scenes/MainScene";
import FoodAnt from "./FoodAnt";
import BaseEntity from "./BaseEntity";
import QueenAnt from "./QueenAnt";
import Ant from "./Ant";



export default class Egg extends BaseEntity {

    private static HATCH_TIME = 100;

    private hatchTimer = 0;
    private Q: QueenAnt;
    
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][], Queen: QueenAnt) {
        super("Egg", 0xe3d6b3, true, true, true, width, height, x, y, gameScene, world);
        this.Q = Queen;
    }

    run() {
        
        this.hatchTimer += 1;

        // If the egg has been around long enough then destroy itself and hatch an egg
        if(this.hatchTimer > Egg.HATCH_TIME) {
            console.log("Egg Hatched");
            this.removeItem();
            this.world[this.x][this.y] = new FoodAnt(this.width, this.height, this.x, this.y, this.scene, this.world, this.Q );
        }

        super.run();
    }
}