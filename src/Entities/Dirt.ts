import BaseEntity from "./BaseEntity";

export default class Dirt extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Dirt", 0x9B7653, true, true, width, height, x, y, gameScene, world);
    }

}