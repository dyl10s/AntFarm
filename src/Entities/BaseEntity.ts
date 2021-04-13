export default class BaseEntity {

    protected tag: string;

    protected width: number;
    protected height: number;

    protected x: number;
    protected y: number;

    protected scene: Phaser.Scene;
    protected world: BaseEntity[][];

    protected rectangle: Phaser.GameObjects.Rectangle;

    protected isGrounded: boolean = false;
    protected useGravity: boolean = true;
    protected isSand: boolean = true;

    public pixelUpdated: boolean = false;

    private simulationRate: number = 100;
    private timeSinceStep: number = 0;

    constructor(tag: string, color: number, useGravity: boolean, isSand: boolean, width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        this.scene = gameScene;
        this.tag = tag;
        this.world = world;
        
        this.x = x;
        this.y = y;
        
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

    public run() {
        // Gravity Simulation    
        if(this.useGravity) {
            if(this.checkForEmpty(this.x, this.y + 1)) { // Fall strait down
                this.moveTo(this.x, this.y + 1);
                this.isGrounded = false;
            }else if(this.isSand && this.checkForEmpty(this.x + 1, this.y + 1)) { // Fall to bottom right
                this.moveTo(this.x + 1, this.y + 1);
                this.isGrounded = false;
            }else if(this.isSand && this.checkForEmpty(this.x - 1, this.y + 1)) { // Fall to bottom right
                this.moveTo(this.x - 1, this.y + 1);
                this.isGrounded = false;
            }else{
                this.isGrounded = true;
            }
        }  
    }

    public moveTo(newX: number, newY: number): boolean {
        if(this.checkForEmpty(newX, newY)) {
            this.world[this.x][this.y] = null;
            this.x = newX;
            this.y = newY;
            this.world[this.x][this.y] = this;
            this.rectangle.setPosition(this.x * this.width, this.y * this.height);
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
}