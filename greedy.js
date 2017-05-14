/* bestFirst.js
 *
 * Author: Brenten Schlangen
 * Contact: schla309@umn.edu, brent@bschlangen.com
 * Date: 4/29/17
 *
 * Description:
 *   This application is built as part of a project to create a graphical
 *   simulation of several common AI search algorithms.
 *   
 *   This file in particular contains a Best-First search algorithm
 *   that is initiated by an html button click event, and depends on
 *   the search space from searchSpace.js
 *
 *   Its utilizes an online heuristic, that is away of the goal nodes (x, y)
 *   coordinates.
 */


$(window).on('load', function(){
    $('#greedy-button').on('click', function(){
    	if(isStartSet && isEndSet){
    		
    		beginGreedy();
    		setEndTimer();
    		updateUIWithStackChanges();
    	}
    	else{
    		alert('Select a Start and End point in the search space.');
    	}
    })
});

function beginGreedy(){

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

		var validNeighbors = getNeighbors(current);
		for(let i=0; i<validNeighbors.length; i++){

			var successor = validNeighbors[i];
			// if successor is the goal, stop the search
			if(isGoal(successor.getI(), successor.getJ())){
				//visitNode(successor.getI(), successor.getJ(), explored, current);
				successor.setParent(current);
				// alert('found goal = successor');
				return true;
			}

			if(!closed.includes(successor)){

				// if new path to neighbour is shorter OR neighbour is not in OPEN
				if( (current.getGValue()+1 < successor) || !open.includes(successor)){
					// set f_cost of neighbour
					// successor.g = q.g + distance between successor and q
					successor.setGValue = current.getGValue() + 1;
		   			// successor.h = distance from goal to successor
		   			successor.setHValue(calculateHValue(successor));
		   			// successor.f = successor.g + successor.h
		   			var f = successor.getHValue();


					// if neighbour is not in OPEN
					if(!open.includes(successor)){
						// add neighbour to OPEN
						open.push(successor);
						visitNode(successor.getI(), successor.getJ(), explored, current);

						// Update Parent chain
						// var closestNeighbor = getClosestNeighborToStart(successor);
						// if( closestNeighbor.getGValue() < successor.getGValue()){
						// 	successor.setParent(closestNeighbor);
						// }
					}
				}
			}
		}
	}
	alert('Goal could not be reached.');
}