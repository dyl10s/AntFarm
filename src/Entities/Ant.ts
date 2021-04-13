import BaseEntity from "./BaseEntity";

export default class Ant extends BaseEntity {

    private dir = 1;
    private steps = 10;

    private itemHolding: BaseEntity = null;
    
    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Ant", 0x822a3e, true, false, width, height, x, y, gameScene, world);
    }

    run() {
        super.run();

        if(this.isGrounded) {
            if(this.dir == 1) {
                this.moveRight();
            }else{
                this.moveLeft();
            }

            this.steps++;

            // Randomly Grab
            if(this.itemHolding == null && Math.floor(Math.random() * 15) + 1 == 1) {
                this.grabItemBelow();
            }

            // Randomly Drop
            if(this.itemHolding != null && Math.floor(Math.random() * 15) + 1 == 1) {
                console.log("Drop")
                this.itemHolding.addItem(this.x, this.y - 1);
                this.itemHolding = null;
            }

            // Randomly move
            if(this.steps > Math.random() * 100 + 1) {
                this.steps = 0;
                this.dir = -this.dir;
            }
        }
    }


    // Ants can step up 1 block
    moveRight() {
        if(!this.moveTo(this.x + 1, this.y)) {
            this.moveTo(this.x + 1, this.y - 1)
        }
    }

    moveLeft() {
        if(!this.moveTo(this.x - 1, this.y)) {
            this.moveTo(this.x - 1, this.y - 1)
        }
    }

    grabItemBelow() {
        let itemBelow = this.world[this.x][this.y + 1];
        if(itemBelow != null){
            if(itemBelow.tag == "Dirt" || itemBelow.tag == "Grass"){
                itemBelow.removeItem();
                this.itemHolding = itemBelow;
            }
        }
        
    }
}