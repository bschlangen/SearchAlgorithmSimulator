/* searchSpace.js
 *
 * Author: Brenten Schlangen
 * Contact: schla309@umn.edu, brent@bschlangen.com
 * Date: 4/2/17
 *
 * Description:
 *   This application is built as part of a project to create a graphical
 *   simulation of several common AI search algorithms.
 *   
 *   This file in particular is responsible for setting up an empty search
 *   space, and allowing the user to select 'start' and 'goal' spaces within a
 *   table, as well designating certain spaces as 'blocked'.
 *   
 *   This simulation is intended to represent a traditional path finding 
 *   problem.
 */



// Globals used throughout the application
const TABLE_CONTAINNER_NAME = '#table-container'
const N = 22;
var isStartSet = false;
var isEndSet = false;
var mouseDown = false;
var mainArray = [];
var UIStack = [];
var startNode = null;
var endNode = null;
var exploredCount = 0;
var finalPathCount = 0;
var timeout = null;

var startTime = null;
var currentTime = null;

var STATE = Object.freeze({
    EMPTY:1,
    BLOCKED:2,
    START:3,
    END:4,
    VISITED:5
});

// Create an event listener to launch the application.
// This should generate tables and the corresponding array
// to hold data values
$(window).on('load', function(){
    initializeSearchSpace();
});

// Add event listeners to watch for mousedown events
// *** Use the boolean "mousedown" to check if the mouse is currently up or down
$(document).mousedown(function() {
    mouseDown = true;
}).mouseup(function() {
    mouseDown = false;  
});

function initializeSearchSpace() {
    // Create an array to hold spaces
    generateMainArray(N);
    // Create an Empty table
    generateEmptyTable(N);

    $('#reset-button').on('click', function(){
        resetSearchSpace();
    });
}

// Generates the mainArray to be and nxn array with containing EMPTY states
function generateMainArray(n) {
    for(let i = 0; i < n; i++){
        mainArray.push([]);
        for(let j = 0; j < n; j++){
            mainArray[i].push(new Node(i, j, STATE.EMPTY));
        }
    }
}

// Generate an empty table that is nxn in size
function generateEmptyTable(n){
    var tableContainer = $(TABLE_CONTAINNER_NAME);
    tableContainer.innerHTML = '';
    
    var content = '<table id="sim-table">';
    
    // Add each row to the screen
    for(let i = 0; i < n; i++){
        content += '<tr>';
        // Add empty cells
        for(let j = 0; j < n; j++){
            content += '<td class="node empty" id="cell' + i + '-' + j + 
                '" onmouseenter="cellClicked(' + i + ',' + j + ', false)" onmousedown="cellClicked(' + i + ',' + j + ', true)"></td>';
        }
        content += '</tr>';
    }
    tableContainer.append(content);
}

function resetSearchSpace(){
    if(mainArray){
        for(let i = 0; i < mainArray.length; i++){
            for(let j = 0; j < mainArray[0].length; j++){
                mainArray[i][j].setState(STATE.EMPTY);
                $('#cell'+i+'-'+j).attr('class', 'node empty');
            }
        }
    }
    isStartSet = false;
    isEndSet = false;

    // Reset & stop the UI changes & stack
    clearTimeout(timeout);
    UIStack = [];

    // Reset metrics
    exploredCount = 0;
    finalPathCount = 0;
    $('#explored-count').text('0');
    $('#final-path-count').text('0');
    $('#time-count').text('0');
}


function updateUIWithStackChanges(){

    var node = UIStack.shift();
    var i = node.getI();
    var j = node.getJ();

    $('#cell'+i+'-'+j).removeClass('empty');
    $('#cell'+i+'-'+j).addClass('visited');
    $('#explored-count').text(node.getNumber());

    if(UIStack.length > 0){
        timeout = setTimeout(function(){
            updateUIWithStackChanges()
        }, 50);
    }
    else{
        traceBackToFindPath(endNode.getParent());
        $('#time-count').text(currentTime - startTime);
    }
}

// Traces from the goal node, by each node's parent, to reach the start node
// and make the path used to reach the node visible
function traceBackToFindPath(parentNode){
    var i = parentNode.getI();
    var j = parentNode.getJ();

    finalPathCount++;
    if(parentNode.getState() == STATE.START){
        
    }
    else{

        $('#cell'+i+'-'+j).attr('class', 'node solution-path');
        timeout = setTimeout(function(){
            traceBackToFindPath(parentNode.getParent());
        }, 50)
    }
    $('#final-path-count').text(finalPathCount);
}

// Callback to handle when a cell is clicked by the user
function cellClicked(row, column, isClick){
    if((mouseDown || isClick) && (mainArray[row][column].getState() == STATE.EMPTY)){
        if(!isStartSet){
            setStartNode(row, column);
            isStartSet = !isStartSet;
        }
        else if(!isEndSet){
            setEndNode(row, column);
            isEndSet = !isEndSet;
        }
        else{
            blockNode(row, column);
        }
    }
}

function setStartNode(row, column){
    var cell = $('#cell'+row+'-'+column).addClass('start');
    mainArray[row][column].setState(STATE.START);
    startNode = mainArray[row][column];
}

function setEndNode(row, column){
    var cell = $('#cell'+row+'-'+column).addClass('end');
    mainArray[row][column].setState(STATE.END);
    endNode = mainArray[row][column];
}

function blockNode(row, column){
    var cell = $('#cell'+row+'-'+column).attr('class','node blocked');
    mainArray[row][column].setState(STATE.BLOCKED);
}

function visitNode(row, column, exploredList, parentNode){
    // var cell = $('#cell'+row+'-'+column).attr('class', 'node visited');
    mainArray[row][column].setState(STATE.VISITED);

    if(parentNode){
        mainArray[row][column].setParent(parentNode);
    }
    
    exploredList[row][column] = true;
    UIStack.push(mainArray[row][column]);
    exploredCount++;
    mainArray[row][column].setNumber(exploredCount);

    // currentTime = new Date().getTime();
    // mainArray[row][column].setInitialTime(currentTime - startTime);
}

function getStartNode(){
    return startNode;
}

function getEndNode(){
    return endNode;
}

// Uses Global Timer
function startTimer(){
    startTime = new Date().getTime();
}

function setEndTimer(){
    currentTime = new Date().getTime();
}
