import MainScene from "../Scenes/MainScene";

export default class BaseEntity {

    public tag: string;

    protected width: number;
    protected height: number;

    protected x: number;
    protected y: number;

    protected color: number;

    protected scene: MainScene;
    protected world: BaseEntity[][];

    protected rectangle: Phaser.GameObjects.Rectangle;

    protected isGrounded: boolean = false;
    protected useGravity: boolean = true;
    protected isSand: boolean = true;
    protected canGrab: boolean = true;

    public pixelUpdated: boolean = false;

    public stepsSinceLastGravity: number = 0;
    public settleSteps: number = 1;

    private simulationRate: number = 10;
    private timeSinceStep: number = 0;

    private nextMoveX: number = null;
    private nextMoveY: number = null;

    constructor(tag: string, color: number, useGravity: boolean, canGrab: boolean, isSand: boolean, width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        this.scene = gameScene;
        this.tag = tag;
        this.world = world;
        
        this.color = color;
        this.x = x;
        this.y = y;
        
        this.canGrab = canGrab;
        this.isSand = isSand;
        this.useGravity = useGravity;

        this.width = width;
        this.height = height;
        this.rectangle = this.scene.add.rectangle(x * width, y * height, width, height, color);
    }

    public update(delta: number) {
        // This pixel updated is needed because the array is being modified while we are looping through it
        if(this.pixelUpdated == false) {
            this.pixelUpdated = true;
            this.timeSinceStep += delta;    
        
            if(this.simulationRate <= this.timeSinceStep) {
                this.timeSinceStep = 0;
                this.run();
            }
        }
    }

    // We want to move all the pixels at once. This fixes some weird stuff
    public preformMove() {
        if(this.nextMoveX && this.nextMoveY) {
            if(this.world[this.nextMoveX][this.nextMoveY] == null){
                this.world[this.x][this.y] = null;
                this.x = this.nextMoveX;
                this.y = this.nextMoveY;
                this.world[this.x][this.y] = this;
                this.rectangle.setPosition(this.x * this.width, this.y * this.height);
            }
        }
        this.nextMoveX = null;
        this.nextMoveY = null;
    }

    public run() {
        this.stepsSinceLastGravity++;
        // Gravity Simulation    
        if(this.useGravity && this.stepsSinceLastGravity <= this.settleSteps) {
            if(this.checkForEmpty(this.x, this.y + 1)) { // Fall strait down
                
                // If the item can grab then it should be able to stick to walls
                if(this.canGrab && (this.checkForWalls(this.x, this.y - 1) || this.checkForWalls(this.x - 1, this.y) || this.checkForWalls(this.x + 1, this.y))) {
                    return;
                }

                this.moveTo(this.x, this.y + 1);
                this.isGrounded = false;
                this.stepsSinceLastGravity = 0;

            }else if(this.isSand && this.checkForEmpty(this.x + 1, this.y + 1) && this.checkForEmpty(this.x + 1, this.y)) { // Fall to bottom right
                this.moveTo(this.x + 1, this.y + 1);
                this.isGrounded = false;
                this.stepsSinceLastGravity = 0;
            }else if(this.isSand && this.checkForEmpty(this.x - 1, this.y + 1) && this.checkForEmpty(this.x - 1, this.y)) { // Fall to bottom right
                this.moveTo(this.x - 1, this.y + 1);
                this.isGrounded = false;
                this.stepsSinceLastGravity = 0;
            }else{
                this.isGrounded = true;
            }
        }
    }

    public moveTo(newX: number, newY: number): boolean {
        if(this.checkForEmpty(newX, newY)) {
            this.stepsSinceLastGravity = 0;
            this.nextMoveX = newX;
            this.nextMoveY = newY;
            return true;
        }else{
            return false;
        }
    }

    public checkForEmpty(xLoc: number, yLoc: number) {
        
        if(xLoc < 0) {
            return false;
        }

        if(yLoc < 0) {
            return false;
        }

        if(xLoc > this.world.length) {
            return false;
        }

        if(yLoc > this.world[xLoc].length) {
            return false;
        }

        if(this.world[xLoc][yLoc] != null) {
            return false;
        }        

        return true;
    }

    public checkForWalls(xLoc: number, yLoc: number) {
        
        if(xLoc < 0) {
            return true;
        }

        if(yLoc < 0) {
            return true;
        }

        if(xLoc > this.world.length) {
            return true;
        }

        if(yLoc > this.world[xLoc].length) {
            return true;
        } 

        if(this.world[xLoc][yLoc] != null && 
            (this.world[xLoc][yLoc].tag == "Dirt" || this.world[xLoc][yLoc].tag == "Grass" || this.world[xLoc][yLoc].tag == "Egg")) {
            return true;
        }     

        return false;
    }

    public checkForGrabable(xLoc: number, yLoc: number) {
        
        if(xLoc < 0) {
            return false;
        }

        if(yLoc < 0) {
            return false;
        }

        if(xLoc > this.world.length) {
            return false;
        }

        if(yLoc > this.world[xLoc].length) {
            return false;
        } 

        if(this.world[xLoc][yLoc] != null && (this.world[xLoc][yLoc].tag == "Dirt" || this.world[xLoc][yLoc].tag == "Grass")) {
            return true;
        }     

        return false;
    }

    public removeItem() {
        this.pixelUpdated = true;
        this.rectangle.destroy();
        this.rectangle = null;
        this.world[this.x][this.y] = null;
    }

    public addItem(x: number, y: number) {
        if(this.world[x][y] == null) {
            this.pixelUpdated = true;
            this.stepsSinceLastGravity = 0;
            this.x = x;
            this.y = y;
            this.rectangle = this.scene.add.rectangle(x * this.width, y * this.height, this.width, this.height, this.color);
            this.world[this.x][this.y] = this;
        }
    }
}