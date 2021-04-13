import * as Phaser from 'phaser';
import Ant from '../Entities/Ant';
import BaseEntity from '../Entities/BaseEntity';
import Dirt from '../Entities/Dirt';
import Grass from '../Entities/Grass';

export default class MainScene extends Phaser.Scene
{
    private ant: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private world: BaseEntity[][];

    private pixelsX: number;
    private pixelsY: number;

    private pixelSize: number;

    private gameWidth: number = 800;
    private gameHeight: number = 600;

    constructor() {
        super("MainScene");
        this.ant = null;
        this.world = new Array<Array<BaseEntity>>();
        this.pixelSize = 10;

        this.pixelsX = this.gameWidth / this.pixelSize;
        this.pixelsY = this.gameHeight / this.pixelSize;
    }

    preload() {
    }
    
    create() {        
        // Create the game world and make it empty
        for(let x = 0; x <= this.pixelsX; x++) {
            let newItem: BaseEntity[]  = new Array<BaseEntity>(); 
            for(let y = 0; y <= this.pixelsY; y++) {
                newItem.push(null);
            }
            this.world.push(newItem);
        }

        // Create the dirt
        for(let x = 0; x <= this.pixelsX; x++) {
            for(let y = Math.floor(this.pixelsY / 3); y <= this.pixelsY; y++) {
                this.world[x][y] = new Dirt(this.pixelSize, this.pixelSize, x, y, this, this.world);
            }
        }

        // Create the grass
        for(let x = 0; x <= this.pixelsX; x++) {
            for(let y = Math.floor(this.pixelsY / 3) - 2; y <= Math.floor(this.pixelsY / 3); y++) {
                this.world[x][y] = new Grass(this.pixelSize, this.pixelSize, x, y, this, this.world);
            }
        }

        // Showing off gravity
        this.world[15][0] = new Ant(this.pixelSize, this.pixelSize, 15, 0, this, this.world);
        this.world[15][7] = new Dirt(this.pixelSize, this.pixelSize, 15, 7, this, this.world);
        this.world[15][6] = new Dirt(this.pixelSize, this.pixelSize, 15, 6, this, this.world);
        this.world[15][5] = new Dirt(this.pixelSize, this.pixelSize, 15, 5, this, this.world);
        this.world[15][4] = new Dirt(this.pixelSize, this.pixelSize, 15, 4, this, this.world);
        this.world[15][3] = new Dirt(this.pixelSize, this.pixelSize, 15, 3, this, this.world);
        this.world[15][2] = new Dirt(this.pixelSize, this.pixelSize, 15, 2, this, this.world);
        this.world[15][1] = new Dirt(this.pixelSize, this.pixelSize, 15, 1, this, this.world);
        
    }
    
    update(time: number, delta: number) {
        for(let x = 0; x < this.pixelsX; x++) {
            for(let y = this.pixelsY - 1; y >= 0; y--) {
                if(this.world[x][y] != null) {
                    this.world[x][y].update(delta);
                }
            }
        }

        // clear out the updated flag
        for(let x = 0; x < this.pixelsX; x++) {
            for(let y = this.pixelsY - 1; y >= 0; y--) {
                if(this.world[x][y] != null) {
                    this.world[x][y].pixelUpdated = false;
                }
            }
        }
    }
}