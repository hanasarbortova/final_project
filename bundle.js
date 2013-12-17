;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

	//----------------------button listeners------------------------------
	var startObstacle = document.getElementById("startObstacle");
	startObstacle.addEventListener("click",getPolygons,false);
	
	var nextObstacle = document.getElementById("nextObstacle");
	nextObstacle.addEventListener("click",nextPolygon,false);	
	
	var finishObstacles = document.getElementById("finishObstacles");
	finishObstacles.addEventListener("click",initializePolygons,false);	
	
	var initialPosition = document.getElementById("initialPosition");
	initialPosition.addEventListener("click",getInitialPosition,false);	
	
	var targetPosition = document.getElementById("targetPosition");
	targetPosition.addEventListener("click",getTargetPosition,false);
	
	var demo = document.getElementById("demo");
	demo.addEventListener("click",loadDemo,false);
	
	var startAnimation = document.getElementById("startAnimation");
	startAnimation.addEventListener("click",animate,false);
	
	//--------------------------------------------------------------------
	

	var enlargeObstacles = require("./enlargeObstacles.js")
	var motionPlanning = require("./motionPlanning.js")

	
	var canvas = document.getElementById("canvas");	
	var context = canvas.getContext('2d');
	
	var width = 800;
	var height = 400;
	var agent_radius = 7;	
	context.fillRect(0, 0, width, height);

	var enlarged_obstacles = new Array();
	var polygons = new Array();
	var points = new Array();
	var path = new Array();
	var index_polygons = 0;
	var index_points = 0;
	var target_point = [width-agent_radius,height-agent_radius];
	var current_target_point = new Array(2);
	var current_vector = new Array(2);
	var index_current_target;
	var agent_point = [agent_radius,agent_radius];

	//---------POLYGONS----------------------------------------------------
	//#1		
	function getPolygons(){
		//enable mouse listener
		//save points to array
		//draw point and rectangle
			
		canvas.addEventListener("mousedown", getPolygonsListener, false);
		
		
	}
	
	//#1 listener
	function getPolygonsListener(event){
		points[index_points] = getPosition();
		index_points++;
		drawPolygons();
	}		
	
	//#2
	function nextPolygon(){
		//initialize new array
		polygons[index_polygons] = points;
		index_polygons++;
		points = new Array();
		index_points = 0;
		console.log(points);
		console.log(polygons);
		drawPolygons();
	}
	
	//#3		
	function initializePolygons(){
		nextPolygon();
		canvas.removeEventListener ("mousedown",getPolygonsListener,false);
		
	}
	
	// will be called from #1 #2 #3 #6
	function drawPolygons(){
		var i,j;
		context.fillStyle = '#f00';
		for(i=0;i<index_polygons;i++){
			context.beginPath();
			context.moveTo(polygons[i][0][0], polygons[i][0][1]);
			for(j=0;j<polygons[i].length;j++){
				context.lineTo(polygons[i][j][0], polygons[i][j][1]);
			}
			context.closePath();
			context.fill();
			
		}
		
		
		if(points.length > 0){
			context.beginPath();
			context.moveTo(points[0][0], points[0][1]);
			for(j=0;j<points.length;j++){
				context.lineTo(points[j][0], points[j][1]);
			}
			context.closePath();
			context.fill();
		}
		
	}
	
	//enlarged obstacles
	function drawEnlargedObstacles(){
		var i,j;
		context.fillStyle = '#000';
		for(i=0;i<enlarged_obstacles.length;i++){
			context.beginPath();
			context.moveTo(enlarged_obstacles[i][0][0], enlarged_obstacles[i][0][1]);
			for(j=0;j<enlarged_obstacles[i].length;j++){
				context.lineTo(enlarged_obstacles[i][j][0], enlarged_obstacles[i][j][1]);
			}
			context.closePath();
			context.fill();
			context.lineWidth = 2;
      		context.strokeStyle = '#f00';
      		context.fill();
      		context.stroke();
      		
			
		}
	}
	
	//-------------------END POLYGONS---------------------------------------------
		
	//-------------------AGENT (initial) POSITION-------------------------------------------	
	//#4		
	function getInitialPosition(){
		canvas.addEventListener("mousedown", getInitialPositionListener, false);
	}
	
	function getInitialPositionListener(event){
		agent_point = getPosition();
		drawAgent();
		canvas.removeEventListener ("mousedown",getInitialPositionListener,false);
	}
	
	function drawAgent(){
		context.beginPath();
		context.fillStyle = '#0f0';
		context.arc(agent_point[0], agent_point[1], agent_radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
	
	//-------------------END INITIAL POSITION-------------------------------------------

	//-------------------TARGET POSITION-------------------------------------------
	//#5
	function getTargetPosition(){
		canvas.addEventListener("mousedown", getTargetPositionListener, false);
	}
	
	function getTargetPositionListener(){
		target_point = getPosition();
		drawTarget();
		canvas.removeEventListener ("mousedown",getTargetPositionListener,false);
	}
	
	function drawTarget(){
	  context.beginPath();
      context.arc(target_point[0], target_point[1], agent_radius, 0, 2 * Math.PI, false);
      context.fillStyle = '#000';
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = '#00f';
      context.stroke();
	}
	//-------------------END TARGET POSITION-------------------------------------------
	
	//#6
	function loadDemo(){
		//TODO
		//console.log("polygons:");
		//console.log(polygons);
		//console.log("init:");
		//console.log(agent_point);
		//console.log("target:");
		//console.log(target_point);
		//-------demo1-------------------------------------------------------------------
		//polygons = [[[20,20],[50,50],[20,50]],[[300,200],[300,300],[200,300],[200,200]]];
		//console.log(polygons);
		//index_polygons = 2;
		//index_points = 0;
		//agent_point = [100,100];
		//target_point = [500,300];
		//-------demo2-------------------------------------------------------------------
		polygons = [     [[269,87],[349,161],[154,339],[133,170]]     ,[[732,190],[472,290],[443,72]]];
		index_polygons = 2;
		index_points = 0;
		agent_point = [49,119];
		target_point = [724,251];
		//-------demo end-------------------------------------------------------------------
		context.clearRect(0,0,width,height);
		context.fillStyle = '#000';
		context.fillRect(0, 0, width, height);
		drawPolygons();
		drawAgent();
		drawTarget();
		

	}
	
  
    function getPosition()
      {
        var x = new Number();
        var y = new Number();
        //var canvas = document.getElementById("canvas");

        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
	
        console.log("x: " + x + "  y: " + y);
        return [x,y];
      }
		
	//-------------ANIMATION-------------------------------------------------------------
	
	function animate(){
		//initialize some computation
		enlarged_obstacles = enlargeObstacles(polygons, agent_radius);
		
		var i,j;
		
		var starting_point = new Array(2);
		starting_point[0] = agent_point[0];
		starting_point[1] = agent_point[1];
		path = motionPlanning(starting_point, target_point, enlarged_obstacles, width, height);	
		current_target_point[0] = agent_point[0];
		current_target_point[1] = agent_point[1];
		index_current_target = 0;
		updateAnimation();
	}
	
	
	function updateAnimation(){
		console.log("update")
		//call updating functions, ie agent_point = fcn();
		if(Math.abs(agent_point[0] - current_target_point[0]) < 1 && 
			Math.abs(agent_point[1] - current_target_point[1]) < 1){
			index_current_target++;
			if(index_current_target < path.length){
				current_target_point = path[index_current_target];
				current_vector[0] = current_target_point[0] - agent_point[0];
				current_vector[1] = current_target_point[1] - agent_point[1];
				var size_current_vector = Math.sqrt(current_vector[0]*current_vector[0] + current_vector[1]*current_vector[1]);
				current_vector[0] /= size_current_vector;
				current_vector[1] /= size_current_vector;
			}else{
				index_current_target--;
				current_vector[0] = 0;
				current_vector[1] = 0;
			}
		}
		
		agent_point[0] = agent_point[0] + current_vector[0];
		agent_point[1] = agent_point[1] + current_vector[1];
		//console.log(agent_point);
		
		context.clearRect(0,0,width,height);
		context.fillStyle = '#000';
		context.fillRect(0, 0, width, height);
		drawEnlargedObstacles();
		drawPolygons();
		drawTarget();
		drawPath();
		drawAgent();
		//drawTriangulation();
		setTimeout(updateAnimation, 10); 
	}
	
	function drawPath(){
		var i;
		for(i=0; i < path.length-1; i++){
			context.beginPath();
			context.moveTo(path[i][0],path[i][1]);
			context.lineTo(path[i+1][0],path[i+1][1]);
			context.strokeStyle = '#00f';
			context.stroke();
			context.closePath();
		}
	}
	

	
	
	
	

},{"./enlargeObstacles.js":2,"./motionPlanning.js":3}],2:[function(require,module,exports){
module.exports = enlargeObstacles

function enlargeObstacles(polygons, radius){
	var i,j;
	var enlarged_obstacles = new Array(polygons.length);
	var vector1 = new Array();
	var vector2 = new Array();
	
	for(i = 0; i < polygons.length; i++){
		var l = polygons[i].length;
		enlarged_obstacles[i] = new Array(polygons[i].length);
		for(j = 0; j < l; j++){
			// get line and their intersection
			var line1 = getLine(polygons[i][j],polygons[i][(j+1)%l]);
			//console.log(line1);
			
			if(j==0){
				var line2 = getLine(polygons[i][l-1],polygons[i][j]);			
			}else{
				var line2 = getLine(polygons[i][j-1],polygons[i][j]);		
			} 
			
			line1[2] += radius;
			line2[2] += radius;
			
			enlarged_obstacles[i][j] = getLinesIntersection(line1, line2);
			console.log(enlarged_obstacles[i][j]);
			
		}
	}
	return enlarged_obstacles;	
}

function getLinesIntersection(line1,line2){
	var cross_product = getVectorProduct(line1,line2);
	var intersection = new Array();
	intersection[0] = cross_product[0]/cross_product[2];
	intersection[1] = cross_product[1]/cross_product[2];
	return intersection;
	
}

function getVectorProduct(vector1, vector2){
	var result = new Array(3);
	result[0] = vector1[1]*vector2[2] - vector1[2]*vector2[1];
    result[1] = vector1[2]*vector2[0] - vector1[0]*vector2[2];
    result[2] = vector1[0]*vector2[1] - vector1[1]*vector2[0];
    return result;	 
}

function getLine(point1,point2){
	var vector = getNormalizedVector(point1,point2);
	//console.log(vector);
	vector = getNormalVector(vector);
	var c = -point1[0]*vector[0] - point1[1]*vector[1];
	//console.log(vector);
	return [vector[0],vector[1],c];
		 
}

function getNormalVector(vector){
	
	return [-vector[1],vector[0]]; 
}

function getVector(point1,point2){ //works
	var vector = new Array();
	vector[0] = point2[0]-point1[0];
	vector[1] = point2[1]-point1[1];
	return vector;
}

function getNormalizedVector(point1,point2){
	var vector = getVector(point1,point2);
	console.log(vector);
	var vector_size = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
	console.log(vector_size);
	vector[0] /= vector_size;
	vector[1] /= vector_size;
	console.log(vector);
	return vector;
}



},{}],3:[function(require,module,exports){
//var triangulate = require("delaunay-triangulate");

module.exports = motionPlanning
var d = require('euclidean-distance');
var segseg = require('segseg');


function motionPlanning(agent_point_current, target_point, obstacles, width, height){
	var next_point = [0,0];
	var path = new Array();
	path[0] = [agent_point_current[0],agent_point_current[1]];
	var path_index = 1;
	var current_i = Number.MAX_VALUE;
	var current_j = Number.MAX_VALUE;
	
	// do I see the obstacle from my current location (agent_point)?
	while(path_index<10){//(next_point[0]!=target_point[0] && next_point[1]!=target_point[1]){
		// if yes, put only this to the path and break
		if(isPointVisible(agent_point_current, target_point, obstacles)){
			path[path_index] = [target_point[0],target_point[1]];
			//console.log("target_visble")
			break
		}else{
			//console.log("target_not_visble")
		}
		
		// what are the points (obstacle corners that i currently see)
		var i,j;
		var d_closest = Number.MAX_VALUE;
		var d_current = 0;
		var closest_i = 0;
		var closest_j = 0;

		for(i = 0; i < obstacles.length; i++){ // increment obstacles
			
			var l = obstacles[i].length;

			if(i == current_i){
				console.log("same i")
				if(current_j == 0){
					d_current = d(agent_point_current,obstacles[i][l-1]) + d(obstacles[i][l-1],target_point);
					if(d_closest > d_current){
						d_closest = d_current
						closest_i = i;
						closest_j = l-1;
						
					}					
				}else{
					d_current = d(agent_point_current,obstacles[i][current_j-1]) + d(obstacles[i][current_j-1],target_point)
					if(d_closest > d_current){
						d_closest = d_current
						closest_i = i;
						closest_j = current_j-1;						
					}
				}
				d_current = d(agent_point_current,obstacles[i][(current_j+1)%l]) + d(obstacles[i][(current_j+1)%l],target_point)
				if(d_closest > d_current){
						d_closest = d_current
						closest_i = i;
						closest_j = (current_j+1)%l;
				}
				
				continue
			}
			
			for(j = 0; j < l; j++){ // increment nodes
				
				
				
				if(isPointVisible(agent_point_current, obstacles[i][j],obstacles)){
					// compute deistance between current location and this point and save the distance
					// in dstance is smaller than the current minimum, replace it
					// add this point to the path 	

					if(current_i!=i && current_j!=j){				
					var d_current = d(agent_point_current,obstacles[i][j]) + d(obstacles[i][j],target_point);

					if(d_current < d_closest){

						d_closest = d_current;

						closest_i = i;
						closest_j = j;
						
					}
					}
				}
			}
		}
		

		path[path_index] = [obstacles[closest_i][closest_j][0],obstacles[closest_i][closest_j][1]]

		current_i = closest_i
		current_j = closest_j
		path_index++;
		agent_point_current[0] = obstacles[closest_i][closest_j][0]
		agent_point_current[1] = obstacles[closest_i][closest_j][1]
		console.log(agent_point_current)
		
			
				
	}
	
	console.log("path:")
	console.log(path[0])
	console.log(path[1])
	console.log(path[2])

	
	return path;
}

function isPointVisible(agent_point_current, current_target_point, obstacles){
		var i,j;
		var intersecting = false;

		for(i = 0; i < obstacles.length; i++){ // increment obstacles
			var l = obstacles[i].length;
			for(j = 0; j < l; j++){ // increment nodes
				
				var isect = segseg(agent_point_current[0], agent_point_current[1], current_target_point[0], current_target_point[1], 
					obstacles[i][j][0], obstacles[i][j][1], obstacles[i][(j+1)%l][0], obstacles[i][(j+1)%l][1]);

				if(isect != undefined && isect != true && d(isect,current_target_point)>1 && d(isect,agent_point_current)>1){ // WARNING ROUNDING!!!!!
					intersecting = true;

					break
					
				}
			}
			

		}	
		
			if(intersecting){
				console.log("intersecting");
				return false
				//break
			}else{
				console.log("NOT_intersecting");
				return true
			}
		
		
	
}

},{"euclidean-distance":4,"segseg":5}],4:[function(require,module,exports){
// http://en.wikipedia.org/wiki/Euclidean_distance#Three_dimensions

module.exports = function(a, b) {

  // return Math.sqrt(
  //   Math.pow(a[0]-b[0], 2) +
  //   Math.pow(a[1]-b[1], 2) +
  //   Math.pow(a[2]-b[2], 2)
  // )

  // return Math.sqrt(
  //   [0,1,2].reduce(function(prev, current, i) {
  //     return prev + Math.pow(a[i]-b[i], 2);
  //   }, 0)
  // );

  var sum = 0;
  var n;
  for (n=0; n < a.length; n++) {
    sum += Math.pow(a[n]-b[n], 2);
  }
  return Math.sqrt(sum);
}
},{}],5:[function(require,module,exports){
/*  Ported from Mukesh Prasad's public domain code:
 *    http://tog.acm.org/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (x1,y1) -- (x2,y2)
 *   and the input points (x3,y3) -- (x4,y4) intersect.
 *   If the lines intersect, the return value is an array
 *   containing coordinates of the point of intersection.
 *
 *   Params
 *        x1, y1,  x2, y2   Coordinates of endpoints of one segment.
 *        x3, y3,  x4, y4   Coordinates of endpoints of other segment.
 *
 *   Also Accepts:
 *    4 objects with the minimal object structure { x: .., y: ..}
 *    4 arrays where [0] is x and [1] is y
 *
 *   The value returned by the function is one of:
 *
 *        undefined - no intersection
 *        array     - intersection
 *        true      - colinear
 */

module.exports = function(x1, y1, x2, y2, x3, y3, x4, y4) {

  if (arguments.length === 4) {
    var p1 = x1;
    var p2 = y1;
    var p3 = x2;
    var p4 = y2;

    // assume array [x, y]
    if (p1.length && p1.length === 2) {
      x1 = p1[0];
      y1 = p1[1];
      x2 = p2[0];
      y2 = p2[1];
      x3 = p3[0];
      y3 = p3[1];
      x4 = p4[0];
      y4 = p4[1];

    // assume object with obj.x and obj.y
    } else {
      x1 = p1.x;
      y1 = p1.y;
      x2 = p2.x;
      y2 = p2.y;
      x3 = p3.x;
      y3 = p3.y;
      x4 = p4.x;
      y4 = p4.y;
    }
  }


  var a1, a2, b1, b2, c1, c2; // Coefficients of line eqns.
  var r1, r2, r3, r4;         // 'Sign' values
  var denom, offset;          // Intermediate values
  var x, y;                   // Intermediate return values

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x  +  b1 y  +  c1  =  0".
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2;

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1;
  r4 = a1 * x4 + b1 * y4 + c1;

  // Check signs of r3 and r4.  If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ( r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0))) {
    return; // no intersection
  }


  // Compute a2, b2, c2
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;

  // Compute r1 and r2
  r1 = a2 * x1 + b2 * y1 + c2;
  r2 = a2 * x2 + b2 * y2 + c2;

  // Check signs of r1 and r2.  If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0))) {
    return; // no intersections
  }

  // Line segments intersect: compute intersection point.
  denom = a1 * b2 - a2 * b1;

  if ( denom === 0 ) {
    return true;
  }

  offset = denom < 0 ? - denom / 2 : denom / 2;

  x = b1 * c2 - b2 * c1;
  y = a2 * c1 - a1 * c2;

  return [
    ( x < 0 ? x : x ) / denom,
    ( y < 0 ? y : y ) / denom,
  ];
};

},{}]},{},[1])
;