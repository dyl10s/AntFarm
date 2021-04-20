import * as Phaser from 'phaser';
import Ant from '../Entities/Ant';
import BaseEntity from '../Entities/BaseEntity';
import Dirt from '../Entities/Dirt';
import Grass from '../Entities/Grass';
import QueenAnt from '../Entities/QueenAnt';

export default class MainScene extends Phaser.Scene
{
    private ant: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private world: BaseEntity[][];

    private pixelsX: number;
    private pixelsY: number;

    public pixelSize: number = 5;

    public gameWidth: number = 800;
    public gameHeight: number = 600;

    constructor() {
        super("MainScene");
        this.ant = null;
        this.world = new Array<Array<BaseEntity>>();

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
            for(let y = Math.floor(this.pixelsY / 3) - 2; y <= Math.floor(this.pixelsY / 3) - 1; y++) {
                this.world[x][y] = new Grass(this.pixelSize, this.pixelSize, x, y, this, this.world);
            }
        }

        // Spawn Queen
        this.world[75][0] = new QueenAnt(this.pixelSize, this.pixelSize, 75, 1, this, this.world);
    }
    
    update(time: number, delta: number) {
        for(let x = 0; x < this.pixelsX; x++) {
            for(let y = 0; y < this.pixelsY; y++) {
                if(this.world[x][y] != null) {
                    this.world[x][y].update(delta);
                }
            }
        }

        for(let x = 0; x < this.pixelsX; x++) {
            for(let y = 0; y < this.pixelsY; y++) {
                if(this.world[x][y] != null) {
                    this.world[x][y].preformMove();
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