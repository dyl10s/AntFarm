import * as Phaser from "phaser";
import FindPath from "../Helpers/Pathfind";
import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";
import QueenAnt from "./QueenAnt";

export default class Ant extends BaseEntity {

    private dir = 1;
    private steps = 10;

    private itemHolding: BaseEntity = null;

    private tunnelLocation: number [] = [];

    private goal = "ExpandNest";

    private digSpot: any [] = [];

    private Queen: QueenAnt;
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][], Queen: QueenAnt) {
        super("Ant", 0x822a3e, true, true, false, width, height, x, y, gameScene, world);
        this.Queen = Queen;
        this.digSpot = [this.Queen.nestLocation[0], this.Queen.nestLocation[1]];
        this.rectangle.disableInteractive();
        
    }

    run() {
        super.run();

        if(this.isGrounded) { 
            this.expandNest();
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
        let nextStep = FindPath(this.world, this.x, this.y, this.Queen.nestEntrypoint[0], this.Queen.nestEntrypoint[1] + 1, false, false, true);

        if(nextStep == null) {
            console.log(this.itemHolding);
            this.placeItemRandomly();
            
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
        }
    }


    selectDirtRandomly() {
        let validLocations = [];
        
        if(this.checkForGrabable(this.x, this.y)){
            validLocations.push([this.x, this.y]);
        }

        if(this.checkForGrabable(this.x - 1, this.y)){
            validLocations.push([this.x - 1, this.y]);
        }

        if(this.checkForGrabable(this.x - 1, this.y - 1)){
            validLocations.push([this.x - 1, this.y - 1]);
        }

        if(this.checkForGrabable(this.x, this.y - 1)){
            validLocations.push([this.x, this.y - 1]);
        }

        if(this.checkForGrabable(this.x + 1, this.y)){
            validLocations.push([this.x + 1, this.y]);
        }

        let selectedLoc = validLocations[Math.floor(Math.random() * validLocations.length)];
        return selectedLoc;
    }


    expandNest(){
        // if(this.goal == "expandNest"){

        //     if(this.itemHolding){
        //         this.placeItemAtEntry();
        //         return;
        //     }
            
        //     let moveToNest = FindPath(this.world, this.x, this.y, this.digSpot[0], this.digSpot[1], false, true, true);
        //         if(moveToNest != null && moveToNest[0] == 0 && moveToNest[1] == 0){
        //             // Pick some piece of dirt to expandhole
        //             let findRandomDirt = this.selectDirtRandomly();
        //             if(findRandomDirt) {
        //                 console.log("found one")
        //                 this.digSpot = findRandomDirt;
        //                 this.grabItem(findRandomDirt[0], findRandomDirt[1]);
        //             }
        //         }else if(moveToNest != null){
        //             this.moveTo(moveToNest[0], moveToNest[1]);
        //         } else{
                    
        //         }

            
        // }
        if(this.goal == "ExpandNest") {
            
            // Pick a food hole target location
            if(this.tunnelLocation.length == 0) {
                let foodHoleY = this.Queen.nestLocation[1] + Math.floor(Math.random() * 20) + 10;
                //let foodHoleX = this.Queen.nestEntrypoint[0] < 80 ? Math.floor(Math.random() * 10) + 5 : -(Math.floor(Math.random() * 10) + 5)
                let foodHoleX = this.Queen.nestEntrypoint[0] < 80 ? 140 : 20;
                this.tunnelLocation.push(foodHoleX, this.y);
                
                    
                console.log("The tunnel location is " + this.tunnelLocation[0] + " " + this.tunnelLocation[1]);
            }

            // If we are not holding anything, dig the nest
            if(!this.itemHolding){
                //Walk as close as we can
                let nextStep = FindPath(this.world, this.x, this.y, this.tunnelLocation[0], this.tunnelLocation[1], true, false, true);
                // Check if we have arrived
                if(nextStep[0] == 0 && nextStep[1] == 0){
                    //make tunnel from here to the entrance
                }

                // Check if the next step will be in dirt
                if(this.checkForWalls(nextStep[0], nextStep[1])){


                    this.grabItem(nextStep[0], nextStep[1]);

                }else{
                    this.moveTo(nextStep[0], nextStep[1]);
                }
            }
            else // If we are holding something return it to the nest entrypoint
            {
                this.placeItemAtEntry();
                
            }
            
        }
        
    }
}