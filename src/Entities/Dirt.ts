import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";

export default class Dirt extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        super("Dirt", 0x9B7653, true, false, true, width, height, x, y, gameScene, world);
    }

}