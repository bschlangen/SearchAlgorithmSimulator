/* astar.js
 *
 * Author: Brenten Schlangen
 * Contact: schla309@umn.edu, brent@bschlangen.com
 * Date: 4/29/17
 *
 * Description:
 *   This application is built as part of a project to create a graphical
 *   simulation of several common AI search algorithms.
 *   
 *   This file in particular contains a A* (Astar) search algorithm
 *   that is initiated by an html button click event, and depends on
 *   the search space from searchSpace.js
 *
 *   Its utilizes an online heuristic, that is away of the goal nodes (x, y)
 *   coordinates.
 */


$(window).on('load', function(){
    $('#astar-button').on('click', function(){
    	if(isStartSet && isEndSet){
    		// startTimer();
    		beginAStar();
    		setEndTimer();
    		updateUIWithStackChanges();
    	}
    	else{
    		alert('Select a Start and End point in the search space.');
    	}
    })
});

var HEURISTIC_WEIGHT = 3;
// var HEURISTIC_WEIGHT = 2; // Sweet Spot?

function beginAStar(){
	// Setup all of the G-Values of the search space
	setGValues();

	// TODO: Phase out the explored list in favor of marking nodes as visited
	var explored = produceUnexploredArray(N*N);

	startTimer();
	// OPEN - the set of nodes to be evaluated
	var open = [];
	// CLOSED - the set of nodes already evaluated
	var closed = [];
	// add the start node to OPEN
	var node = getStartNode();
	node.setGValue(0);
	node.setHValue(0);
	open.push(node);
	// loop
	while(open.length > 0){
		// current = node in OPEN with the lowest f_cost
		// remove current from OPEN
		var current = retrieveMinFCostNode(open);
	//     add current to CLOSED
		closed.push(current);
		visitNode
	//     if current is the target node //path has been found
		if(isGoal(current.getI(), current.getJ())){
			// alert('found goal = current');
			return true;
		}

		// This is an attempt at improving the algorithm's parent tracing
		var closestNeighbor = getClosestNeighborToStart(current);
		if( closestNeighbor.getGValue() < current.getGValue()){
			current.setParent(closestNeighbor);
		}

		var validNeighbors = getNeighbors(current);
		for(let i=0; i<validNeighbors.length; i++){

			var successor = validNeighbors[i];
			// if successor is the goal, stop the search
			if(isGoal(successor.getI(), successor.getJ())){
				//visitNode(successor.getI(), successor.getJ(), explored, current);
				current.setState(STATE.VISITED);
				successor.setParent(current);
				// alert('found goal = successor');
				return true;
			}

			if(!closed.includes(successor)){

				// if new path to neighbour is shorter OR neighbour is not in OPEN
				if( (current.getGValue()+1 < successor) || !open.includes(successor)){
					// set f_cost of neighbour
					// successor.g = q.g + distance between successor and q
					successor.setGValue( current.getGValue() + 1);
		   			// successor.h = distance from goal to successor
		   			successor.setHValue(calculateHValue(successor));
		   			// successor.f = successor.g + successor.h
		   			var f = successor.getGValue() + successor.getHValue();

		   			successor.setParent(current);

					// if neighbour is not in OPEN
					if(!open.includes(successor)){
						// add neighbour to OPEN
						open.push(successor);
						visitNode(successor.getI(), successor.getJ(), explored, current);
					}
					// Update Parent chain
					var closestNeighbor = getClosestNeighborToStart(successor);
					if( closestNeighbor.getGValue() < successor.getGValue()){
						successor.setParent(closestNeighbor);
					}
				}
			}
		}
	}
	alert('Goal could not be reached.');
}

// Set g values of each node based on the starting point
// This algorithm needs further improvement, as it currently does not factor traversing around
// blocked nodes. It should essentially take some variation of a BFS, and set the G value when
// the each node is visited
// function setGValues(){
// 	var startI = getStartNode().getI();
// 	var startJ = getStartNode().getJ();
// 	var current = null;
// 	// Traverse the mainArray of nodes and set their g values
// 	for(let i=0; i<mainArray.length; i++){
// 		for(let j=0; j<mainArray[0].length; j++){
// 			current = mainArray[i][j];
// 			current.setGValue(Math.abs(startI - current.getI()) + Math.abs(startJ - current.getJ()));
// 		}
// 	}
// }

// TODO: Clean this up, it's gross and hacky
function setGValues(){
	var start = getStartNode();

	// Make an empty queue
	var frontier = new Queue();

	// Make an unvisited array
	var exploredList = produceUnexploredArray(N*N);
	
	// Mark starting node as visisted & enqueue it
	exploredList[start.getI()][start.getJ()] = true;
	frontier.enqueue(start);

	while(!frontier.isEmpty()){
		var node = frontier.dequeue();
		
		var i = node.getI();
		var j = node.getJ();

		var neighbors = getNeighbors(node);

		for(let index=0; index < neighbors.length; index++){
			var neighbor = neighbors[index];
			neighbor.setGParent(node);
			if(!isVisited(neighbor.getI(), neighbor.getJ(), exploredList)){
				// neighbor.setState(STATE.VISITED);
				exploredList[neighbor.getI()][neighbor.getJ()] = true;
				neighbor.setGValue(countGParents(neighbor));
				frontier.enqueue(neighbor);
			}
		}
	}

	return false
}

function countGParents(node){
	var count = 1;
	while(node.getState() != STATE.START && count<20){
		count++;
		node = node.getGParent();
	}
	return count;
}

function getNeighbors(node){
	var neighbors = [];
	
	// Top neighbor
	if(isValidNeighbor(node.getI()-1, node.getJ())){
		neighbors.push(mainArray[node.getI()-1][node.getJ()]);
	}
	// Right neighbor
	if(isValidNeighbor(node.getI(), node.getJ()+1)){
		neighbors.push(mainArray[node.getI()][node.getJ()+1]);
	}
	// Bottom neighbor
	if(isValidNeighbor(node.getI()+1, node.getJ())){
		neighbors.push(mainArray[node.getI()+1][node.getJ()]);
	}
	// Left neighbor
	if(isValidNeighbor(node.getI(), node.getJ()-1)){
		neighbors.push(mainArray[node.getI()][node.getJ()-1]);
	}
	return neighbors;
}

function calculateHValue(node){
	var goalI = getEndNode().getI();
	var goalJ = getEndNode().getJ();

	var a = Math.abs(goalI - node.getI());
	var b = Math.abs(goalJ - node.getJ())
	var a2 = Math.pow(a, 2);
	var b2 = Math.pow(b, 2);

	return HEURISTIC_WEIGHT * Math.sqrt(a2 + b2);
}

function getClosestNeighborToStart(node, open){
	var neighbors = getNeighbors(node);
	var lowest = node;

	for(let i=0; i<neighbors.length; i++){
		if(neighbors[i].getGValue() < lowest.getGValue() && (neighbors[i].getState() == STATE.VISITED)){
			lowest = neighbors[i];
		}
	}
	return lowest;
}

// Removes the node with the lowest F value and returns it
function retrieveMinFCostNode(nodeArray){
	// Make sure an array was passed in
	if(nodeArray.constructor === Array){
		var lowest = nodeArray[0];

		for(let i=0; i<nodeArray.length; i++){
			var current = nodeArray[i];
			var f = current.getGValue() + current.getHValue();
			if(f < lowest.getHValue() + lowest.getGValue()){
				lowest = current;
			}
		}

		// Remove the lowest from the nodeArray
		var lowestIndex = nodeArray.indexOf(lowest);
		if (lowestIndex > -1) {
    		nodeArray.splice(lowestIndex, 1);
		}
		return lowest;
	}
}