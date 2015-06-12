// Author: Gorkem Kata gorkemkata@gmail.com 12.06.2015

	// Some global variables
	var MATRIX_WIDTH;
	var MATRIX_HEIGHT;
	var PIXEL_SIZE; // pixels are drawed as rectangles to a html5 canvas. this is the rectangle size.
	var DELAY; // delay between paint animations
	var WHITE_RATE; // Rate of of white pixels compared to others. Lower the white rate, higher the colors and shapes

	var COLOR_COUNT = 4; // If extra colors are added, this can be incremented.

	var mainMatrix; // this is the main matrix that we will fill randomly.
	 
	// matrices of colors. in depth explanation in generateColorsMatrix method.
	var blueMatrix;
	var redMatrix;
	var orangeMatrix;
	var greenMatrix;
	
	// these are the animated canvasses 
	var redResultCanvas;
	var blueResultCanvas;
	var orangeResultCanvas;
	var greenResultCanvas;

	// Since the algorithm is recursive, we should always "wait" one more tick than the previous cycle.
	var nextDrawDelay;
	
	// result string.
	var result = "";
	
	
	function initialization() {
	
	result = "";
	
	// take variables from respective html tags
	MATRIX_WIDTH =  parseInt(document.getElementById("matrixWidth").value);
	MATRIX_HEIGHT =  parseInt(document.getElementById("matrixHeight").value);
	PIXEL_SIZE =  parseInt(document.getElementById("pixelSize").value);
	DELAY = parseInt(1100 - document.getElementById("delay").value);
	WHITE_RATE = parseInt(document.getElementById("whiteRate").value);

	// the matrix or image, is created randomly.
	mainMatrix = generateRandomMatrix(getCanvas('mainCanvas', MATRIX_WIDTH ,MATRIX_HEIGHT), MATRIX_WIDTH, MATRIX_HEIGHT);
	
	// some DOM stuff
	redResultCanvas = getCanvas('redResultCanvas', MATRIX_WIDTH ,MATRIX_HEIGHT);
	blueResultCanvas = getCanvas('blueResultCanvas', MATRIX_WIDTH ,MATRIX_HEIGHT);
	orangeResultCanvas = getCanvas('orangeResultCanvas', MATRIX_WIDTH ,MATRIX_HEIGHT);
	greenResultCanvas = getCanvas('greenResultCanvas', MATRIX_WIDTH ,MATRIX_HEIGHT);
	
	// Generating colors matrices. I.e. for blue, we assign 1 to all blue pixels and 0 to all other.
	blueMatrix = generateColorsMatrix('blue',getCanvas('blueCanvas',MATRIX_WIDTH ,MATRIX_HEIGHT),MATRIX_WIDTH,MATRIX_HEIGHT);
	redMatrix = generateColorsMatrix('red',getCanvas('redCanvas',MATRIX_WIDTH ,MATRIX_HEIGHT),MATRIX_WIDTH,MATRIX_HEIGHT);
	orangeMatrix = generateColorsMatrix('orange',getCanvas('orangeCanvas',MATRIX_WIDTH ,MATRIX_HEIGHT),MATRIX_WIDTH,MATRIX_HEIGHT);
	greenMatrix= generateColorsMatrix('green',getCanvas('greenCanvas',MATRIX_WIDTH ,MATRIX_HEIGHT),MATRIX_WIDTH,MATRIX_HEIGHT);
	
	// Could have done this via a matrix of matrices but this is easier to read.
	findShapes(blueMatrix,blueResultCanvas,'blue');
	findShapes(redMatrix,redResultCanvas,'red');
	findShapes(orangeMatrix,orangeResultCanvas,'orange');
	findShapes(greenMatrix,greenResultCanvas,'green');
	
	// write the result to the html p tag
	document.getElementById("result").innerHTML = result;

}
 
	function findShapes(matrix,canvas,color) {
	
		nextDrawDelay = 0; // we don't wait for first pixel.
		var shapeCount = 0;
		for (var row = 0; row < MATRIX_HEIGHT; ++row) {
			for (var column = 0; column < MATRIX_WIDTH; ++column){ // travelling across the matrix
				if (matrix[row][column] === 1) { // if the pixel is one, it means it a colored one
					matrix[row][column] = color; // we give it a unique value (not a 0 or 1) so that we wont check this pixel again. 
												// it is a string now. consider that we used " === " , it also checks type.
												
					setTimeout(paintPixel, nextDrawDelay * DELAY, column, row, color); // paint after some delay.
					
					++nextDrawDelay; // this is important since we are using a recursive algorithm and setTimeout is 
									// a thread based method. If we don't put this here, every cycle will be done in nearly same time.
					
					createShape(matrix,row, column, color); // recursive function to travel across the shape.
					
					shapeCount++; // if we are here, it means we found a shape.
					
				}
			}
		}
		 result += "&nbsp&nbsp&nbsp&nbsp&nbsp"+color+" shape count is: "+shapeCount; // dirty string operations

	}

	function createShape(matrix, row, column, color) {
	// What this method does is simply look for up, bottom left and right pixels and if it is a colored one,
	// call itself for that specific pixel too. we paint the confirmed pixels to the respective color so that we wont be checking
	// them again. If you slow down the animation, it is easier to understand here.
		if (row - 1 >= 0 && matrix[row - 1][column] === 1) {
			matrix[row - 1][column] = color;
			setTimeout(paintPixel, nextDrawDelay * DELAY, column, row - 1, color);
			++nextDrawDelay;
			createShape(matrix,row - 1, column, color);
		}
		if (row + 1 < MATRIX_HEIGHT && matrix[row + 1][column] === 1) {
			matrix[row + 1][column] = color;
			setTimeout(paintPixel, nextDrawDelay * DELAY, column, row + 1, color);
			++nextDrawDelay;
			createShape(matrix,row + 1, column, color);
		}
		if (column - 1 >= 0 && matrix[row][column - 1] === 1) {
			matrix[row][column - 1] = color;
			setTimeout(paintPixel, nextDrawDelay * DELAY, column - 1, row, color);
			++nextDrawDelay;
			createShape(matrix,row, column - 1, color);
		}
		if (column + 1 < MATRIX_WIDTH && matrix[row][column + 1] === 1) {
			matrix[row][column + 1] = color;
			setTimeout(paintPixel, nextDrawDelay * DELAY, column + 1, row, color);
			++nextDrawDelay;
			createShape(matrix,row, column + 1, color);
		}

	}
	
	function generateRandomMatrix(canvas, width, height) {
		var row = height;
		var column;
		var randomMatrix = [];
		while (--row > -1) { // we create columns equals to the number of rows
			randomMatrix[row] = [];
			column = width;
			while (--column > -1) {
				
				// random number between 0 and white rate + color count
				randomMatrix[row][column] = Math.round(Math.random() * (WHITE_RATE + (COLOR_COUNT) ) );
				
				// we paint the top canvas according to the main matrix. all other colors have same possibility
				// but white has more if set so. First "WHITE_RATE" numbers are white, add 1 and it is blue, 
				// add one and it is red and so on.
				if( randomMatrix[row][column] >= 0 && randomMatrix[row][column] <= WHITE_RATE )
					canvas.fillStyle = 'white';
				else if( randomMatrix[row][column] === (WHITE_RATE + 1) )
					canvas.fillStyle = 'red';
				else if( randomMatrix[row][column] === (WHITE_RATE + 2) )
					canvas.fillStyle = 'blue';
				else if( randomMatrix[row][column] === (WHITE_RATE + 3) )
					canvas.fillStyle = 'green';
				else if( randomMatrix[row][column] === (WHITE_RATE + 4) )
					canvas.fillStyle = 'orange';		
				
				// actual painting
				canvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
				
				}
		}
		return randomMatrix;
	}

	function generateColorsMatrix(color, colorCanvas, width, height) {
		var row = height;
		var column;
		var matrix = [];
		while (--row > -1) {
			matrix[row] = [];
			column = width;
			while (--column > -1) {
				// If the pixel is our color, assing 1 to it. Otherwise 0. So we have our
				// color specific matrices.
				switch(color){
					case 'red':
						if( mainMatrix[row][column] === (WHITE_RATE + 1) ){
							colorCanvas.fillStyle = 'red';
							matrix[row][column] = 1;
							}
						else{
							colorCanvas.fillStyle = 'white';
							matrix[row][column] = 0;	
						}
						break;
					case 'blue':
						if( mainMatrix[row][column] === (WHITE_RATE + 2) ){
							colorCanvas.fillStyle = 'blue';
							matrix[row][column] = 1;
							}
						else{
							colorCanvas.fillStyle = 'white';
							matrix[row][column] = 0;	
						}
						break;
					case 'green':
						if( mainMatrix[row][column] === (WHITE_RATE + 3) ){
							colorCanvas.fillStyle = 'green';
							matrix[row][column] = 1;
							}
						else{
							colorCanvas.fillStyle = 'white';
							matrix[row][column] = 0;	
						}
						break;
					case 'orange':
						if( mainMatrix[row][column] === (WHITE_RATE + 4) ){
							colorCanvas.fillStyle = 'orange';
							matrix[row][column] = 1;
							}
						else{
							colorCanvas.fillStyle = 'white';
							matrix[row][column] = 0;	
						}
						break;
					default:
						break;
							
			 }

			colorCanvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
			}
		}
		return matrix;
	}

	function paintPixel(column, row, color){
	
		// Paint the pixel at the coordinates given as parameters according to color.
		// Note that we change the canvas too.
		switch(color){
			case 'red':
				redResultCanvas.fillStyle = color;
				redResultCanvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);				
				break;
			case 'blue':
				blueResultCanvas.fillStyle = color;
				blueResultCanvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);				
				break;
			case 'orange':
				orangeResultCanvas.fillStyle = color;
				orangeResultCanvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);				
				break;
			case 'green':
				greenResultCanvas.fillStyle = color;
				greenResultCanvas.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);				
				break;
		}
	}

	function getCanvas(id, width, height){
		var canvas = document.getElementById(id);
		canvas.width = width * PIXEL_SIZE; // since every pixel is in fact a rectangle
		canvas.height = height * PIXEL_SIZE;
		return canvas.getContext('2d');
	}


