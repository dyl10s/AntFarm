import BaseEntity from "./BaseEntity";
import Egg from "./Egg";
import FindPath from "../Helpers/Pathfind"

export default class QueenAnt extends BaseEntity {

    private itemHolding: BaseEntity = null;

    private goal: string = "Nest";

    private nestLocation: number[] = [];
    private nestEntrypoint: number[] = [];

    private eggLocations: any[] = [];

    constructor(width: number, height: number, x: number, y: number, gameScene: Phaser.Scene, world: BaseEntity[][]) {
        super("Queen", 0x8b0000, true, true, false, width, height, x, y, gameScene, world);
    }

    run() {

        // Queen ant keeps track of the entrypoint
        if(this.nestEntrypoint.length > 0){
            if(this.checkForWalls(this.nestEntrypoint[0] + 1, this.nestEntrypoint[1]) && this.checkForWalls(this.nestEntrypoint[0] - 1, this.nestEntrypoint[1])){
                this.nestEntrypoint[1] = this.nestEntrypoint[1] - 1;
            }
        }

        if(this.isGrounded) {
            
            this.digNest();

        }

        super.run();
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

    placeItem(x: number, y: number) {
        if(this.checkForEmpty(x, y)){
            this.itemHolding.addItem(x, y);
            this.itemHolding = null;
        }
    }

    placeItemAtEntry() {
        let nextStep = FindPath(this.world, this.x, this.y, this.nestEntrypoint[0], this.nestEntrypoint[1] + 1, false, true);

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

    digNest() {
        if(this.goal == "Nest") {
            // Pick a nest target location
            if(this.nestLocation.length == 0) {
                this.nestLocation.push(Math.floor(Math.random() * 80), Math.floor(Math.random() * 30 + 40));
                console.log("The nest location is " + this.nestLocation[0] + " " + this.nestLocation[1]);
            }

            // If we are not holding anything, dig the nest
            if(!this.itemHolding){
                //Walk as close as we can
                let nextStep = FindPath(this.world, this.x, this.y, this.nestLocation[0], this.nestLocation[1], true, false);
                
                // Check if nesting is complete
                if(nextStep[0] == 0 && nextStep[1] == 0){
                    this.goal = "Eggs"
                }

                // Check if the next step will be in dirt
                if(this.checkForWalls(nextStep[0], nextStep[1])){

                    // The first item we grab is the entrypoint of the nest
                    if(this.nestEntrypoint.length == 0){
                        this.nestEntrypoint.push(this.x, this.y);
                        console.log("The nest entrypoint is " + this.nestEntrypoint[0] + " " + this.nestEntrypoint[1]);
                    }

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

    layEggs() {

        if(this.goal == "Eggs") {
            
            // Check for a designated egg laying location
            let eggLocation = this.anyEggLocationsAvailable();
            if(eggLocation != null){
                let stepToEggLocation = FindPath(this.world, this.x, this.y, eggLocation[0], eggLocation[1], false, false);
                if(stepToEggLocation[0] == eggLocation[0] && stepToEggLocation[1] == eggLocation[1]) {

                }else{
                    this.moveTo(stepToEggLocation[0], stepToEggLocation[1]);
                }
            }

        }
    }

    anyEggLocationsAvailable(): number[] | null {
        if(this.eggLocations.length == 0) {
            return null;
        }

        for(let i = 0; i < this.eggLocations.length; i++) {
            if(this.checkForEmpty(this.eggLocations[i].x, this.eggLocations[i].y)){
                return [this.eggLocations[i].x, this.eggLocations[i].y];
            }
        }

        return null;
    }
}