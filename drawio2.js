
window.drawio = {
    shapes: [],
    removedShapes: [],
    moveingShape: [],
    selectedShape: 'draw',
    fontFamilyPick: 'Arial',
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),
    colorPick: document.querySelector('.color-picker'),
    widthPick: document.querySelector('.width-picker'),
    textBox: document.getElementById('idTextBox'),
    selectedElement: null,
    isMoveing: false,
    currentStartX: undefined,
		currentStartY: undefined,
    moveX: undefined,
		moveY: undefined,
    tempShape: undefined,
		movingShape: undefined,
    isDrawing: false,

    availableShapes: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        DRAW: 'draw',
        TEXT: 'text',
        MOVE: 'move'
    }
};

$(function () {
    function drawCanvas() {
      // console.log(drawio.currentStartX);
      // console.log(drawio.currentStartY);
      // console.log(drawio.selectedElement.x);
      // console.log(drawio.selectedElement.y);
        if(drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    }


    $('.icon').on('click', function() {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    $('#undo').on('click', function() {
        if (drawio.shapes.length > 0) {
            let undo = drawio.shapes.pop();
            drawio.removedShapes.push(undo);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();
            console.log(drawio.removedShapes);
            console.log(drawio.shapes);
        }
    });
    $('#redo').on('click', function() {
        if (drawio.removedShapes.length > 0) {
            let redo = drawio.removedShapes.pop();
            drawio.shapes.push(redo);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();
            console.log(drawio.removedShapes);
            console.log(drawio.shapes);
        }
    });

    $('select').on('change', function () {
        drawio.fontFamilyPick = this.value;
    })

    $('#my-canvas').on('mousedown', function(mouseEvent) {
        // if(drawio.selectedShape == 'move') {
        //     var x = mouseEvent.offsetX;
        //     var y = mouseEvent.offsetY;
        //     console.log(x);
        //     console.log(y);
        //     for(var i = 0; i<drawio.shapes.length; i++) {
        //         if(drawio.shapes[i].rectaSize(x, y) && drawio.shapes[i].constuctor.name == "Rectangle") {
        //             console.log(drawio.shapes[i].constuctor.name);
        //             console.log(drawio.shapes[i].position.x);
        //             drawio.moveingShape = drawio.shapes.splice(i, 1);
        //             console.log(drawio.moveingShape);
        //             drawio.isMoveing = true;
        //             drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.moveingShape[drawio.moveingShape.length -1].width, drawio.moveingShape[drawio.moveingShape.length -1].height, drawio.colorPick, drawio.isMoveing);
        //         }
        //     }
        // }

    });
    $('#my-canvas').on('mousedown', function(mouseEvent) {
        drawio.currentStartX = mouseEvent.pageX - this.offsetLeft;
        drawio.currentStartY = mouseEvent.pageY - this.offsetTop;
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
            drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.currentStartX, drawio.currentStartY, "rectangle", 0, 0, drawio.colorPick);
            break;
            case drawio.availableShapes.LINE:
            drawio.selectedElement = new Line({ x: drawio.currentStartX, y: drawio.currentStartY }, drawio.currentStartX, drawio.currentStartY, "line", 0, 0, drawio.widthPick ,drawio.colorPick, drawio.isMoveing);
            break;
            case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.currentStartX, drawio.currentStartY, "circle", drawio.widthPick, drawio.colorPick);
            break;
            case drawio.availableShapes.DRAW:
            drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, "draw", drawio.widthPick, drawio.colorPick);
            drawio.selectedElement.arrx.push(drawio.currentStartX);
            drawio.selectedElement.arry.push(drawio.currentStartY);
            break;
            case drawio.availableShapes.TEXT:
            drawio.selectedElement = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.textBox, drawio.colorPick, drawio.fontFamilyPick);
            $(drawio.textBox).css({"top": mouseEvent.pageY, "left": mouseEvent.pageX});
			      $(drawio.textBox).show();
            break;
            case drawio.availableShapes.MOVE:
            drawio.moveX = drawio.currentStartX;
			      drawio.moveY = drawio.currentStartY;
            //look for a shape at a given point. Start from the newest
      			for(var a = drawio.shapes.length-1; a >= 0; a--){
              // console.log(drawio.currentStartX);
              // console.log(drawio.currentStartY);
              // console.log(drawio.shapes[a].position.x);
              // console.log(drawio.shapes[a].position.y);
              // console.log(drawio.shapes[a].x);
              // console.log("hmm");
              // console.log(drawio.shapes[a].y);
      				if(drawio.shapes[a].findMe(drawio.currentStartX, drawio.currentStartY, drawio.shapes[a])){
      					drawio.movingShape = drawio.shapes[a];
                alert("mja");
                // console.log(drawio.shapes[a].colorPick);
                // console.log("hundur");
      					drawio.selectedElement = drawio.shapes[a];
      					// if a shape is found we remove it ad redraw it later
      					drawio.shapes.splice(a,1);
      					break;
      				}
      			}
            break;
          }
          drawio.isDrawing = true;
    });

    $('#my-canvas').on('mousemove', function(mouseEvent) {
       if (drawio.isDrawing === true) {
         x = mouseEvent.pageX - this.offsetLeft;
         y = mouseEvent.pageY - this.offsetTop;
         if (drawio.selectedShape === "move" && drawio.movingShape !== undefined) {
           var xOff = (drawio.moveX - x)
  				 var yOff = (drawio.moveY - y)
           // console.log(xOff);
           // console.log(yOff);
           if(drawio.movingShape.name === "line"){
              // console.log(drawio.movingShape.colorPick);
  					  drawio.selectedElement = (new Line({x: drawio.movingShape.position.x- xOff,
  						y: drawio.movingShape.position.y - yOff},
  						drawio.movingShape.x - xOff,
  						drawio.movingShape.y - yOff,
              "line",
              0,
              0,
              drawio.widthPick,
  						drawio.colorPick,
  						drawio.width,
              drawio.isMoveing
  						));
              drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
              drawio.selectedElement.resize(drawio.selectedElement.x, drawio.selectedElement.y);
              drawCanvas();
  				}
          else if(drawio.movingShape.name === "rectangle"){
            console.log(drawio.colorPick);
					  drawio.selectedElement = (new Rectangle({x: drawio.movingShape.position.x - xOff,
						y: drawio.movingShape.position.y - yOff},
						drawio.movingShape.x,
						drawio.movingShape.y,
            "rectangle",
            0,
            0,
						drawio.colorPick));
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(drawio.selectedElement.x, drawio.selectedElement.y);
            drawCanvas();
				  }
          else if(drawio.movingShape.name === "circle") {
            // var radiusX = (selectedElement.x - drawio.currentStartX) * 0.5;
			      // var radiusY = (selectedElement.y - drawio.currentStartY) * 0.5;
            drawio.selectedElement = (new Circle({x: drawio.movingShape.position.x - xOff,
            y: drawio.movingShape.position.y - yOff},
            drawio.movingShape.x,
            drawio.movingShape.y,
            "circle",
            drawio.widthPick,
            drawio.colorPick));
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.width = drawio.movingShape.width;
            console.log(drawio.selectedElement.position.x);
            console.log("midja");
            console.log(mouseEvent.offsetX);
            // drawio.selectedElement.resize(x, y);
            drawCanvas();
          }
          else if(drawio.movingShape.name === "draw"){
          drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
					for(var j = 0; j < drawio.movingShape.arrx.length; j++){
						drawio.movingShape.arrx[j] = drawio.movingShape.arrx[j] - xOff
						drawio.movingShape.arry[j] = drawio.movingShape.arry[j] - yOff;
						drawio.moveX = x;
						drawio.moveY = y;
						// drawing is smother when we dont call this function
						//myDrawing.tempShape.draw(context, myDrawing.tempShape)
						drawio.ctx.beginPath();
						drawio.ctx.lineWidth = drawio.movingShape.witdhPick;
						drawio.ctx.strokeStyle = drawio.movingShape.colorPick;
						drawio.ctx.moveTo(drawio.movingShape.arrx[j-1], drawio.movingShape.arry[j-1]);
						drawio.ctx.lineTo(drawio.movingShape.arrx[j], drawio.movingShape.arry[j]);
						drawio.ctx.closePath();
						drawio.ctx.stroke();
            for (var i = 0; i < drawio.shapes.length; i++) {
                drawio.shapes[i].render();
            }
					 }
				  }
         }
         else if (drawio.selectedElement) {
            if (drawio.selectedElement.name === "rectangle") {
              console.log("success");
              drawio.selectedElement.x = x - drawio.currentStartX;
              drawio.selectedElement.y = y - drawio.currentStartY;
            }
            else if (drawio.selectedElement.name === 'draw') {

            }
            else {
              drawio.selectedElement.x = x;
              drawio.selectedElement.y = y;
            }
              // console.log(drawio.selectedElement);
              // console.log(x);
              // console.log("haha");
              // console.log(y);
              // console.log("hehe");
              console.log(drawio.selectedElement);
              drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
              drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
              drawCanvas();
          }
       }
    });

    $('#my-canvas').on('mouseup', function(){
        drawio.isDrawing = false;
        if(drawio.selectedElement) {
            drawio.isMoveing = false;
            console.log(drawio.selectedElement.colorPick);
            console.log("elias");
            drawio.shapes.push(drawio.selectedElement);
            // console.log(drawio.shapes);
            drawio.selectedElement = null;
        }
        drawio.tempShape = undefined;
    	  drawio.movingShape = undefined;
    });
    $('#idTextBox').on('keyup', function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            drawio.selectedElement.textBox = $(this).val();
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(event.offsetX, event.offsetY);
            drawCanvas();
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement = null;
            console.log(drawio.shapes);
            $("#idTextBox").val('');
	        $("#idTextBox").hide();
        }
    });
    
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
