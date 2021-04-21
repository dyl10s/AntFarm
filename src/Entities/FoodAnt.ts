import * as Phaser from "phaser";
import FindPath from "../Helpers/Pathfind";
import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";
import QueenAnt from "./QueenAnt";

export default class FoodAnt extends BaseEntity {

    private dir = 1;
    private steps = 10;

    private itemHolding: BaseEntity = null;

    private goal: string = "FoodHole";

    private Queen: QueenAnt;

    private foodHoleLocation: number[] = [];

    
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][], Queen: QueenAnt) {
        super("FoodAnt", 0x000000, true, true, false, width, height, x, y, gameScene, world);
        this.Queen = Queen;
    }

    run() {
        super.run();

        if(this.isGrounded) {
            //this.digFoodHole();
        }
    }

    grabItem(x: number, y: number): boolean {
        if(!this.itemHolding){
            let item = this.world[x][y];
            if(item != null){
                if(item.tag == "Dirt" || item.tag == "Grass"){
                    item.removeItem();
                    this.itemHolding = item;
                    return true;
                }
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

    placeItemRandomly() {
        
        let validLocations = [];
        
        if(this.checkForEmpty(this.x, this.y)){
            validLocations.push([this.x, this.y]);
        }

        if(this.checkForEmpty(this.x - 1, this.y)){
            validLocations.push([this.x - 1, this.y]);
        }

        if(this.checkForEmpty(this.x - 1, this.y - 1)){
            validLocations.push([this.x - 1, this.y - 1]);
        }

        if(this.checkForEmpty(this.x, this.y - 1)){
            validLocations.push([this.x, this.y - 1]);
        }

        if(this.checkForEmpty(this.x + 1, this.y)){
            validLocations.push([this.x + 1, this.y]);
        }

        if(this.checkForEmpty(this.x + 1, this.y + 1)){
            validLocations.push([this.x + 1, this.y + 1]);
        }

        if(this.checkForEmpty(this.x, this.y + 1)){
            validLocations.push([this.x, this.y + 1]);
        }

        if(this.checkForEmpty(this.x + 1, this.y - 1)){
            validLocations.push([this.x + 1, this.y - 1]);
        }

        if(this.checkForEmpty(this.x - 1, this.y + 1)){
            validLocations.push([this.x - 1, this.y + 1]);
        }

        let dropLoc = validLocations[Math.floor(Math.random() * validLocations.length)];
        if(dropLoc == null) {
            console.log(validLocations);
        }
        this.placeItem(dropLoc[0], dropLoc[1]);
    }

    placeItemAtEntry() {
        let nextStep = FindPath(this.world, this.x, this.y, this.Queen.nestEntrypoint[0], this.Queen.nestEntrypoint[1] + 1, false, true, true);
        if(nextStep == null) {
            if(this.y == this.Queen.nestEntrypoint[1]){
                console.log("PLACED UP TOP");
                this.placeItemRandomly();
                return;
            } else {
                console.log("stuck");
            }
            
        }

        if(nextStep[0] === 0 && nextStep[1] === 0) {
            // Place item to left or right
            let validLocations = [];
            if(!this.checkForWalls(this.x - 1, this.y - 1)){
                validLocations.push({
                    x: this.x - 1,
                    y: this.y - 1
                })
            }

            if(!this.checkForWalls(this.x + 1, this.y - 1)){
                validLocations.push({
                    x: this.x + 1,
                    y: this.y - 1
                })
            }

            let selectedLocation = validLocations[Math.floor(validLocations.length * Math.random())];
            this.placeItem(selectedLocation.x, selectedLocation.y);
        }else{
            this.moveTo(nextStep[0], nextStep[1]);
            //console.log("trying my best");
        }
    }
    

    digFoodHole() {
        if(this.goal == "FoodHole") {

            // Pick a food hole target location
            if(this.foodHoleLocation.length == 0) {
                this.foodHoleLocation.push(
                    Math.floor(Math.random() * this.scene.gameWidth / this.scene.pixelSize - 10) + 10, 
                    Math.max(50, Math.floor(Math.random() * this.scene.gameHeight / this.scene.pixelSize - 5)));
                console.log("The food hole location is " + this.foodHoleLocation[0] + " " + this.foodHoleLocation[1]);
            }

            // If we are not holding anything, dig the nest
            if(!this.itemHolding){
                //Walk as close as we can
                let nextStep = FindPath(this.world, this.x, this.y, this.foodHoleLocation[0], this.foodHoleLocation[1], true, true, true);
                // Check if nesting is complete
                // if(nextStep[0] == 0 && nextStep[1] == 0){
                //     this.goal = "GatherFood";
                // }

                // Check if the next step will be in dirt
                if(this.checkForWalls(nextStep[0], nextStep[1])){


                    this.grabItem(nextStep[0], nextStep[1]);
                    //console.log("made it here");

                }else{
                    this.moveTo(nextStep[0], nextStep[1]);
                    //console.log("trying to move");
                }
            }
            else // If we are holding something return it to the nest entrypoint
            {
                let journeyToNest = FindPath(this.world, this.x, this.y, this.Queen.nestLocation[0], this.Queen.nestLocation[1], true, true, true);
                // Move to the nest, then go up
                if(journeyToNest[0] != this.Queen.nestLocation[0] || journeyToNest[1] != this.Queen.nestLocation[1]){
                    this.moveTo(journeyToNest[0], journeyToNest[1]);
                }
                    
                this.placeItemAtEntry();
            }
            
        }
    }


    
}