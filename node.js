

var Node = function(in_i, in_j, in_state){
	var i = in_i;
	var j = in_j;
	var state = in_state;
	var gValue = 0;
	var hValue = null;

	// Only used when setting G-values
	var gParent = null;

	// Number represents when this node was explored
	// ex: number == 3 means that 
	var number = 0;

	var initialTime = 0;

	// Parent is used to calculate the final path
	var parent = null;

	function publicSetState(s){
		state = s;
	}

	function publicGetState(){
		return state;
	}

	function publicSetParent(p){
		parent = p;
	}

	function publicGetParent(){
		return parent;
	}

	function publicSetNumber(n){
		number = n;
	}

	function publicGetNumber(){
		return number;
	}

	function publicGetI(){
		return i;
	}

	function publicGetJ(){
		return j;
	}

	function publicSetGValue(g){
		gValue = g;
	}

	function publicGetGValue(){
		return gValue;
	}

	function publicSetHValue(h){
		hValue = h;
	}

	function publicGetHValue(){
		return hValue;
	}
	
	function publicSetGParent(gp){
		gParent = gp;
	}

	function publicGetGParent(){
		return gParent;
	}

	function publicSetInitialTime(t){
		initialTime = t;
	}

	function publicGetInitialTime(){
		return initialTime;
	}
	return {
		getI      : publicGetI,
		getJ      : publicGetJ,
		getState  : publicGetState,
		setState  : publicSetState,
		getParent : publicGetParent,
		setParent : publicSetParent,
		getNumber : publicGetNumber,
		setNumber : publicSetNumber,
		getGValue : publicGetGValue,
		setGValue : publicSetGValue,
		getHValue : publicGetHValue,
		setHValue : publicSetHValue,
		getGParent : publicGetGParent,
		setGParent : publicSetGParent, 
		getInitialTime : publicGetInitialTime,
		setInitialTime : publicSetInitialTime
	};
};

// Checks if a node at (i,j) is valid, unblocked, and unvisited
function isValidNeighbor(i, j){
	return (isValidNode(i, j) && !isBlocked(i, j));
}

function isBlocked(i, j){
	return mainArray[i][j].getState() == STATE.BLOCKED;
}

// Checks if state is VISITED
function isVisited(i, j, exploredList){
	return (mainArray[i][j].getState() == STATE.VISITED) || exploredList[i][j] == true;
}

function isGoal(i, j){
	return mainArray[i][j].getState() == STATE.END;
}


function isValidNode(i, j){
	if(i >=0 && j>=0 && i < N && j < N){
		return true;
	}
	else{
		return false;
	}
}