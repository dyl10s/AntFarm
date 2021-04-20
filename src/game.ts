import * as Phaser from 'phaser';
import MainScene from './Scenes/MainScene'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4488AA',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        },
    },
    parent: "game",
    scene: MainScene,
}

const game = new Phaser.Game(config)



