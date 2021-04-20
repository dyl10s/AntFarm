import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";

export default class Grass extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        super("Grass", 0x16ab2f, true, false, true, width, height, x, y, gameScene, world);
    }

}