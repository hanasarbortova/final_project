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
