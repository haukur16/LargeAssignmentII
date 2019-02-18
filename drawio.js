
window.drawio = {
    shapes: [],
    removedShapes: [],
    moveingShape: [],
    arrx: [],
    selectedShape: 'draw',
    fontFamilyPick: 'Arial',
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),
    colorPick: document.querySelector('.color-picker'),
    widthPick: document.querySelector('.width-picker'),
    textBox: document.getElementById('idTextBox'),
    selectedElement: null,
    isMoveing: false,

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
        }
    });
    $('#redo').on('click', function() {
        if (drawio.removedShapes.length > 0) {
            let redo = drawio.removedShapes.pop();
            drawio.shapes.push(redo);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();
        }
    });

    $('select').on('change', function () {
        drawio.fontFamilyPick = this.value;
    })
    /*$('#my-canvas').on('mousedown', function(mouseEvent) {
        if(drawio.selectedShape == 'move') {
            var x = mouseEvent.offsetX;
            var y = mouseEvent.offsetY;
            console.log(x);
            console.log(y);
            for(var i = 0; i<drawio.shapes.length; i++) {
                if(drawio.shapes[i].rectaSize(x, y) && drawio.shapes[i].constuctor.name == "Rectangle") {
                    console.log(drawio.shapes[i].constuctor.name);
                    console.log(drawio.shapes[i].position.x);
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    console.log(drawio.moveingShape);
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.moveingShape[drawio.moveingShape.length -1].width, drawio.moveingShape[drawio.moveingShape.length -1].height, drawio.colorPick, drawio.isMoveing);
                }
                else if(drawio.shapes[i].drawSize(x, y) && drawio.shapes[i].constuctor.name == "Draw" ) {
                    console.log('hi');
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.width, calling.height, drawio.widthPick, drawio.colorPick, drawio.isMoveing, calling.arrx);
                }
            }
        }
    })*/


    $('#my-canvas').on('mousedown', function(mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
            drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorPick);
            break;
            case drawio.availableShapes.LINE:
            drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick ,drawio.colorPick, drawio.isMoveing);
            break;
            case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick, drawio.colorPick, drawio.isMoveing);
            break;
            case drawio.availableShapes.DRAW:
            drawio.arrx = [];
            drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick, drawio.colorPick, drawio.isMoveing, drawio.arrx);
            break;
            case drawio.availableShapes.TEXT:
            drawio.selectedElement = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.textBox, drawio.colorPick, drawio.fontFamilyPick, drawio.widthPick, 0, 0);
            $(drawio.textBox).css({"top": mouseEvent.pageY, "left": mouseEvent.pageX});
			$(drawio.textBox).show();
            break;
            case drawio.availableShapes.MOVE:
            for(var i = 0; i<drawio.shapes.length; i++) {
                var x = mouseEvent.offsetX;
                var y = mouseEvent.offsetY;
                if(drawio.shapes[i].rectaSize(x, y) && drawio.shapes[i].constuctor.name == "Rectangle") {
                drawio.moveingShape = drawio.shapes.splice(i, 1);
                var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                drawio.isMoveing = true;
                drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX , y: mouseEvent.offsetY }, calling.width, calling.height, drawio.colorPick, drawio.isMoveing);
                }
                else if(drawio.shapes[i].drawSize(x, y) && drawio.shapes[i].constuctor.name == "Draw" ) {
                    console.log('is moveing');
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.width, calling.height, drawio.widthPick, drawio.colorPick, drawio.isMoveing, calling.arrx);
                }
                else if(drawio.shapes[i].circleSize(x, y) && drawio.shapes[i].constuctor.name == "Circle" ) {
                    console.log('is moveing');
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.width, calling.height, drawio.widthPick, drawio.colorPick, drawio.isMoveing);
                }
            }
            break;
    }
    });
    
    $('#my-canvas').on('mousemove', function(mouseEvent) {
       if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }

    });

    $('#my-canvas').on('mouseup', function(){
        if(drawio.selectedElement) {
            drawio.isMoveing = false;
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement = null;
            console.log(drawio.shapes);
        }
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
