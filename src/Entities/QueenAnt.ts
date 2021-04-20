import BaseEntity from "./BaseEntity";
import Egg from "./Egg";
import FindPath from "../Helpers/Pathfind"
import MainScene from "../Scenes/MainScene";

export default class QueenAnt extends BaseEntity {

    private itemHolding: BaseEntity = null;

    private goal: string = "Nest";

    private nestLocation: number[] = [];
    private nestEntrypoint: number[] = [];

    private eggLocations: any[] = [];

    constructor(width: number, height: number, x: number, y: number, gameScene: MainScene, world: BaseEntity[][]) {
        super("Queen", 0x8b0000, true, true, false, width, height, x, y, gameScene, world);
    }

    run() {

        // Queen ant keeps track of the entrypoint
        if(this.nestEntrypoint.length > 0){
            if(this.checkForWalls(this.nestEntrypoint[0] + 1, this.nestEntrypoint[1]) && this.checkForWalls(this.nestEntrypoint[0] - 1, this.nestEntrypoint[1])){
                this.nestEntrypoint[1] = this.nestEntrypoint[1] - 1;
            }
        }

        // If the ant is on the ground run the code for the ant
        if(this.isGrounded) {
            
            this.digNest();
            this.layEggs();
        }

        // run the BaseEntity update function
        super.run();
    }

    // Grab an item from a specific location
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

    // Select a radome piece of dirt around the ant
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

    // Place an item randomly around the ant in any available space
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

    // Place an item 
    placeItem(x: number, y: number) {
        if(this.checkForEmpty(x, y)){
            this.itemHolding.addItem(x, y);
            this.itemHolding = null;
        }
    }

    // Place an item at the entrypoint of the nest
    placeItemAtEntry() {
        let nextStep = FindPath(this.world, this.x, this.y, this.nestEntrypoint[0], this.nestEntrypoint[1] + 1, false, false, true);

        if(nextStep == null) {
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

    digNest() {
        if(this.goal == "Nest") {
            // Pick a nest target location
            if(this.nestLocation.length == 0) {
                this.nestLocation.push(
                    Math.floor(Math.random() * this.scene.gameWidth / this.scene.pixelSize), 
                    Math.max(60, Math.floor(Math.random() * this.scene.gameHeight / this.scene.pixelSize - 40)));
                console.log("The nest location is " + this.nestLocation[0] + " " + this.nestLocation[1]);
            }

            // If we are not holding anything, dig the nest
            if(!this.itemHolding){
                //Walk as close as we can
                let nextStep = FindPath(this.world, this.x, this.y, this.nestLocation[0], this.nestLocation[1], true, false, true);
                
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
            
            // Return items to the surface
            if(this.itemHolding){
                this.placeItemAtEntry();
                return;
            }

            // Check for a designated egg laying location
            let eggLocation = this.anyEggLocationsAvailable();
            if(eggLocation != null){
                let stepToEggLocation = FindPath(this.world, this.x, this.y, eggLocation[0], eggLocation[1], true, false, true);

                if(this.checkForGrabable(stepToEggLocation[0], stepToEggLocation[1])){
                    this.grabItem(stepToEggLocation[0], stepToEggLocation[1]);
                    return;
                }

                if(stepToEggLocation[0] == eggLocation[0] && stepToEggLocation[1] == eggLocation[1]) {
                    console.log("Place egg");
                    this.world[eggLocation[0]][eggLocation[1]] = new Egg(this.width, this.height, eggLocation[0], eggLocation[1], this.scene, this.world);
                }else{
                    console.log("Moving to egg location");
                    this.moveTo(stepToEggLocation[0], stepToEggLocation[1]);
                }
            } else {

                let moveToNest = FindPath(this.world, this.x, this.y, this.nestLocation[0], this.nestLocation[1], false, false, true);

                if(moveToNest != null && moveToNest[0] == 0 && moveToNest[1] == 0){
                    // Pick some piece of dirt to remove and make an egg location
                    let findRandomDirt = this.selectDirtRandomly();
                    if(findRandomDirt) {
                        this.grabItem(findRandomDirt[0], findRandomDirt[1]);
                        this.eggLocations.push({
                            x: findRandomDirt[0],
                            y: findRandomDirt[1]
                        });
                    }
                }else if(moveToNest != null){
                    this.moveTo(moveToNest[0], moveToNest[1]);
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