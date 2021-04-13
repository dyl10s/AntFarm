import BaseEntity from "./BaseEntity";

export default class Grass extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Grass", 0x16ab2f, true, true, width, height, x, y, gameScene, world);
    }

}