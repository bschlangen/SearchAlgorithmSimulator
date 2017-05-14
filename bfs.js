/* bfs.js
 *
 * Author: Brenten Schlangen
 * Contact: schla309@umn.edu, brent@bschlangen.com
 * Date: 4/22/17
 *
 * Description:
 *   This application is built as part of a project to create a graphical
 *   simulation of several common AI search algorithms.
 *   
 *   This file in particular contains a Breadth-First search algorithm
 *   that is initiated by an html button click event, and depends on
 *   the search space from searchSpace.js
 *   
 */


$(window).on('load', function(){
    $('#bfs-button').on('click', function(){
    	if(isStartSet && isEndSet){
    		startTimer();
    		beginBFS();
    		setEndTimer();
    		updateUIWithStackChanges();
    	}
    	else{
    		alert('Select a Start and End point in the search space.');
    	}
    })
});

function beginBFS(){
	var node = getStartNode();

	// Make an empty queue
	var frontier = new Queue();

	// Make an unvisited array
	var explored = produceUnexploredArray(N);
	
	// Mark starting node as visisted & enqueue it
	explored[node.getI()][node.getJ()] = true;
	frontier.enqueue(node);

	while(!frontier.isEmpty()){
		node = frontier.dequeue();
		
		if(visitNeighbors(node, explored, frontier)){
			return true;
		}
	}

	alert('Goal could not be reached.');
	return false
}

// Handles checking of node's credentials and enqueueing/ marking as explored
function visitNeighbors(node, exploredList, frontierQueue){
	var i = node.getI();
	var j = node.getJ();

	// Top (i-1, j)
	if(isValidNeighbor(i-1, j)){
		if(isGoal(i-1, j)){
			mainArray[i-1][j].setParent(node);
			return true;
		}
		else if(!isVisited(i-1, j, exploredList)){
			frontierQueue.enqueue(mainArray[i-1][j]);
			visitNode(i-1, j, exploredList, node);
		}
	}
	// Right (i, j+1)
	if(isValidNeighbor(i, j+1)){
		if(isGoal(i, j+1)){
			mainArray[i][j+1].setParent(node);
			return true;
		}
		else if(!isVisited(i, j+1, exploredList)){
			frontierQueue.enqueue(mainArray[i][j+1]);
			visitNode(i, j+1, exploredList, node);
		}
	}
	// Bottom
	if(isValidNeighbor(i+1, j)){
		if(isGoal(i+1, j)){
			mainArray[i+1][j].setParent(node);
			return true;
		}
		else if(!isVisited(i+1, j, exploredList)){
			frontierQueue.enqueue(mainArray[i+1][j]);
			visitNode(i+1, j, exploredList, node);
		}
	}
	// Left
	if(isValidNeighbor(i, j-1)){
		if(isGoal(i, j-1)){
			mainArray[i][j-1].setParent(node);
			return true;
		}
		else if(!isVisited(i, j-1, exploredList)){
			frontierQueue.enqueue(mainArray[i][j-1]);
			visitNode(i, j-1, exploredList, node);
		}
	}

}

function produceUnexploredArray(n){
	var arr = [];
	for(let i = 0; i < n; i++){
		arr.push([]);

		for(let j = 0; j < n; j++){
			arr[i][j] = false;
		}
	}
	return arr;
}