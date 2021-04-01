import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene
{
    private ant: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super("MainScene");
        this.ant = null;
    }

    preload() {
        this.load.image('grass', '/Sprites/GrassTile.png');
        this.load.image('dirt', '/Sprites/DirtTile.png');
        this.load.spritesheet('ants', '/Sprites/ant.png', {
            frameWidth: 170,
            frameHeight: 70
        });
    }
    
    create() {
    
        //add ant with location
        this.ant = this.physics.add.sprite(400, 250, 'ants', 0).setScale(.25);
        this.ant.body.setCollideWorldBounds(true);
        
        // Load grass
        const grassHeight = 300;
        for(let i = 0; i <= 800; i += 32) {
            const grass = this.physics.add.image(i, grassHeight, 'grass');
            grass.body.setAllowGravity(false);
            grass.body.setImmovable(true);
            grass.body.setCollideWorldBounds(true);
            this.physics.add.collider(this.ant, grass);
        }
    
        // load dirt world border
        for(let i = 0; i <= 800; i += 4) {
            this.add.image(i, 600, 'dirt');
        }
    
        for(let i = grassHeight + 18; i <= 600; i += 4) {
            this.add.image(0, i, 'dirt');
            this.add.image(800, i, 'dirt');
        }
    
        // Fill in dirt with physics dirt
        for(let x = 0 + 4; x <= 800 - 4; x += 4) {
            for(let y = grassHeight + 18; y <= 600; y += 4) {
                this.add.image(x, y, 'dirt');
            }
        }
    
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('ants', {start: 1, end: 4})
            
            
        });

        this.ant.play('walk');
    }
    
    update() {
        this.ant.setVelocityX(100);
    }
}