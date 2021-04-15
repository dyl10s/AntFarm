import BaseEntity from "./BaseEntity";
import FindPath from "../Helpers/Pathfind"

export default class QueenAnt extends BaseEntity {

    private itemHolding: BaseEntity = null;

    private goal: string = "Nest";
    private lastDir: string = "Right";
    private initialNestRightWidth: number = 0;
    private initialNestLeftWidth: number = 0;

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Queen", 0x8b0000, true, true, false, width, height, x, y, gameScene, world);
    }

    run() {
        super.run();

        if(this.isGrounded) {
            
            this.digNest();

        }
    }

    // Ants can step up 1 block
    moveRight() {
        if(!this.moveTo(this.x + 1, this.y)) {
            return this.moveTo(this.x + 1, this.y - 1)
        }

        return true;
    }

    moveLeft() {
        if(!this.moveTo(this.x - 1, this.y)) {
            return this.moveTo(this.x - 1, this.y - 1)
        }

        return true;
    }

    grabItemBelow(): boolean {
        return this.grabItem(this.x, this.y + 1)
    }

    grabItem(x: number, y: number): boolean {
        let item = this.world[x][y];
        if(item != null){
            if(item.tag == "Dirt" || item.tag == "Grass"){
                item.removeItem();
                this.itemHolding = item;
                return true;
            }
        }

        return false;
    }

    placeItem(x: number, y: number) {
        if(this.checkForEmpty(x, y)){
            this.itemHolding.addItem(x, y);
            this.itemHolding = null;
        }
    }

    digNest() {
        if(this.goal == "Nest") {
            if(this.itemHolding == null) {

                // Nest Building Logic
                let step = FindPath(this.world, this.x, this.y, 50, 90, true);
                if(step){
                    if(this.world[step[0]][step[1]] != null){
                        this.grabItem(step[0], step[1]);
                    }else{
                        this.moveTo(step[0], step[1]);
                    }
                }else{
                    // rip
                    this.removeItem();
                }
                
            }else{
                if(this.checkForEmpty(this.x + 1, this.y - 1) && this.y < 40) {
                    this.placeItem(this.x + 1, this.y - 1);
                }
                else if(this.checkForEmpty(this.x - 1, this.y - 1) && this.y < 40) {
                    this.placeItem(this.x - 1, this.y - 1);
                }else{
                    let step = FindPath(this.world, this.x, this.y, 50, 10);
                    if(step == null){
                        step = FindPath(this.world, this.x, this.y, 50, 10, true);
                        while(this.itemHolding){
                            let dropX = Math.round(Math.random() * 2 - 1);
                            let dropY = Math.round(Math.random() * 1 - 1);
                            this.placeItem(this.x + dropX, this.y + dropY);
                        }
                        this.moveTo(step[0], step[1]);
                    }else{
                        this.moveTo(step[0], step[1]);
                    }
                    
                }
            }
        }
    }
}