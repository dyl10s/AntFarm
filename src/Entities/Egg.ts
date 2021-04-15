import BaseEntity from "./BaseEntity";

export default class Egg extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Egg", 0xe3d6b3, true, false, true, width, height, x, y, gameScene, world);
    }

}