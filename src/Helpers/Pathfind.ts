import BaseEntity from "../Entities/BaseEntity";

let openList: Node[] = [];
let closedList: Node[] = [];

// This function uses the A* algorithm to find a path from 1 point to another
export default function FindPath(world: BaseEntity[][], startX: number, startY: number, targetX: number, targetY: number, ignoreDirt: boolean = false, ignoreAnts: boolean = false, sticky: boolean = false): number[] {

    if(startX == targetX && startY == targetY){
        return [0, 0];
    }

    openList = [];
    closedList = [];

    let startNode = new Node(null, startX, startY);
    openList.push(startNode);

    while(openList.length != 0){

        let curNode: Node;
        let curNodeIndex: number;
        
        openList.forEach((n, i) => {
            if(curNode == null || n.f < curNode.f){
                curNode = n;
                curNodeIndex = i;
            }
        });

        openList.splice(curNodeIndex, 1);
        closedList.push(curNode);

        // We found the target, return the first step
        if(curNode.x == targetX && curNode.y == targetY) {
            while (curNode != null) {
                if(curNode.parent == null || curNode.parent.parent == null){
                    return [curNode.x, curNode.y];
                }
                curNode = curNode.parent;
            }
        }

        // Get all the possible moves
        let childrenNodes: Node[] = [];

        if(checkMoveable(world, curNode.x + 1, curNode.y, ignoreDirt, ignoreAnts, sticky)){
            let newChild = new Node(curNode, curNode.x + 1, curNode.y);
            childrenNodes.push(newChild);
        }

        if(checkMoveable(world, curNode.x - 1, curNode.y, ignoreDirt, ignoreAnts, sticky)){
            let newChild = new Node(curNode, curNode.x - 1, curNode.y);
            childrenNodes.push(newChild);
        }

        if(checkMoveable(world, curNode.x, curNode.y - 1, ignoreDirt, ignoreAnts, sticky)){
            let newChild = new Node(curNode, curNode.x, curNode.y - 1);
            childrenNodes.push(newChild);
        }

        if(checkMoveable(world, curNode.x, curNode.y + 1, ignoreDirt, ignoreAnts, sticky)){
            let newChild = new Node(curNode, curNode.x, curNode.y + 1);
            childrenNodes.push(newChild);
        }

        childrenNodes.forEach(child => {
            if(closedList.find((openNode) => openNode.x == child.x && openNode.y == child.y)){
                return;
            }

            child.g = curNode.g + 1;
            child.h = Math.pow(child.x - targetX, 2) + Math.pow(child.y - targetY, 2);
            child.f = child.g + child.h;

            // We don't want to dig if we don't have to
            if(world[child.x][child.y] != null) {
                child.f += 1000;
            }

            let existingNode = openList.find((openNode) => openNode.x == child.x && openNode.y == child.y);
            if(existingNode && child.g > existingNode.g){
                return;
            }else{
                openList.push(child);
            }
        })

        if(closedList.length == world.length * world[0].length){
            return null;
        }
    }

    return null;
}


class Node {

    public parent: Node;
    public x: number;
    public y: number;

    // AStart values
    public g: number = 0;
    public h: number = 0;
    public f: number = 0;

    constructor(parent: Node, x: number, y: number) {
        this.parent = parent;
        this.x = x;
        this.y = y;
    } 

}

// Check if we can move in a specific space. This is ued for pathfinding.
function checkMoveable(world: BaseEntity[][], xLoc: number, yLoc: number, ignoreDirt: boolean, ignoreAnts: boolean, sticky: boolean) {
        
    if(xLoc < 0) {
        return false;
    }

    if(yLoc < 0) {
        return false;
    }

    if(xLoc > world.length) {
        return false;
    }

    if(yLoc > world[xLoc].length) {
        return false;
    }

    if(world[xLoc][yLoc] != null && (!ignoreDirt || (world[xLoc][yLoc].tag != "Dirt" && world[xLoc][yLoc].tag != "Grass")) && (!ignoreAnts || (world[xLoc][yLoc].tag != "Queen" && world[xLoc][yLoc].tag != "Ant"))) {
        return false;
    }        

    if(!sticky && world[xLoc][yLoc + 1] == null) {
        return false;
    }

    if(sticky && (world[xLoc - 1][yLoc] == null && world[xLoc + 1][yLoc] == null)) {
        return false;
    }

    return true;
}