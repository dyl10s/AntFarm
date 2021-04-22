import * as Phaser from "phaser";
import FindPath from "../Helpers/Pathfind";
import MainScene from "../Scenes/MainScene";
import BaseEntity from "./BaseEntity";
import Food from "./Food";
import QueenAnt from "./QueenAnt";

export default class FoodAnt extends BaseEntity {


    private itemHolding: BaseEntity = null;

    private goal: string = "FoodHole";

    private Queen: QueenAnt;

    private foodHoleLocation: number[] = [];
    private foodLocation: any [] = [];

    
    
    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][], Queen: QueenAnt) {
        super("FoodAnt", 0x000000, true, true, false, width, height, x, y, gameScene, world);
        this.Queen = Queen;
    }

    run() {
        super.run();

        if(this.isGrounded) {
            this.digFoodHole();
            this.expandHole();
            this.gatherFood();
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
            console.log("null");
            this.placeItemRandomly();
            return;
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
    

    digFoodHole() {
        if(this.goal == "FoodHole") {
            
            // Pick a food hole target location
            if(this.foodHoleLocation.length == 0) {
                let foodHoleY = this.Queen.nestLocation[1] + Math.floor(Math.random() * 20) + 10;
                let foodHoleX = this.Queen.nestEntrypoint[0] < 80 ? Math.floor(Math.random() * 10) + 5 : -(Math.floor(Math.random() * 10) + 5)
                
                this.foodHoleLocation.push(this.Queen.nestEntrypoint[0] + foodHoleX, foodHoleY);
                
                    
                console.log("The food hole location is " + this.foodHoleLocation[0] + " " + this.foodHoleLocation[1]);
            }

            // If we are not holding anything, dig the nest
            if(!this.itemHolding){
                //Walk as close as we can
                let nextStep = FindPath(this.world, this.x, this.y, this.foodHoleLocation[0], this.foodHoleLocation[1], true, false, true);
                // Check if nesting is complete
                if(nextStep[0] == 0 && nextStep[1] == 0){
                    let foodLocY = Math.floor(37);
                    let foodLocX = this.Queen.nestEntrypoint[0] < 80 ? Math.floor(Math.random() * 150) + 120 :Math.floor(Math.random() * 10) + 30
                    console.log("TestX: " + foodLocX);
                    console.log("TestY: " + foodLocY);
                    this.world[foodLocX][foodLocY] = new Food(this.width, this.height, foodLocX, foodLocY, this.scene, this.world, this.Queen);
                    this.foodLocation.push({
                        x: foodLocX,
                        y: foodLocY
                    });
                    this.goal = "ExpandHole";
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
                //add something to move to nest then go up 
                
                this.placeItemAtEntry();
            }
            
        }
    }

    //EXPAND HOLE - NEEDS TO EXPAND MORE
    expandHole(){
        if(this.goal == "ExpandHole") {
            if(this.itemHolding){
                this.placeItemAtEntry();
                return;
            }
            let digSpot = [this.foodHoleLocation[0], this.foodHoleLocation[1]];
            let moveToNest = FindPath(this.world, this.x, this.y, digSpot[0], digSpot[1], false, false, true);

                //console.log(moveToNest);
                if(moveToNest != null && moveToNest[0] == 0 && moveToNest[1] == 0){
                    // Pick some piece of dirt to expandhole
                    let findRandomDirt = this.selectDirtRandomly();
                    if(findRandomDirt) {
                        digSpot = findRandomDirt;
                        this.grabItem(findRandomDirt[0], findRandomDirt[1]);
                    }
                }else if(moveToNest != null){
                    this.moveTo(moveToNest[0], moveToNest[1]);
                } else{
                    this.goal = "GatherFood";
                }


        }
    }

    gatherFood(){
        if(this.goal == "GatherFood"){
            let pathToFood = FindPath(this.world, this.x, this.y, this.foodLocation[0], this.foodLocation[1], false, true, true);

            if(this.itemHolding){
                this.placeItemInFoodHole();
                return;
            }

            if(pathToFood[0] === 0 && pathToFood[1] === 0) {

                console.log("i have arrived at the food");
                this.goal = ("Die");
                
            }else{
                this.moveTo(pathToFood[0], pathToFood[1]);
            }

        }
    }

    placeItemInFoodHole(){

    }


    
}