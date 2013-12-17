
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
	

	
	
	
	
