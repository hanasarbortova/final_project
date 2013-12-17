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


