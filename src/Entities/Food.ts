import * as Phaser from "phaser";
import FindPath from "../Helpers/Pathfind";
import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";
import QueenAnt from "./QueenAnt";

export default class Food extends BaseEntity {

    private Q: QueenAnt;
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][], Queen: QueenAnt) {
        super("Food", 0xFF5E13, true, true, false, width, height, x, y, gameScene, world);
        this.Q = Queen;
        this.color = this.randomColor();
    }

    randomColor(): number{
        let colors = [0xFF5E13, 0xFF3333, 0x00FF00]

        return Math.floor(colors[Math.random() * colors.length]);

    }
    run() {
        super.run();
        
        
        
    }
}