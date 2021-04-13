import BaseEntity from "./BaseEntity";

export default class Ant extends BaseEntity {

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Ant", 0x822a3e, true, false, width, height, x, y, gameScene, world);
    }

    run() {
        super.run();

        if(this.isGrounded) {
            this.moveRight();
        }
    }


    // Ants can step up 1 block
    moveRight() {
        if(!this.moveTo(this.x + 1, this.y)) {
            this.moveTo(this.x + 1, this.y - 1)
        }
    }
}