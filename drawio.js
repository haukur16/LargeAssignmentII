
window.drawio = {
    shapes: [],
    selectedShape: 'draw',
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),
    colorPick: document.querySelector('.color-picker'),
    widthPick: document.querySelector('.width-picker'),
    textBox: document.getElementById('idTextBox'),
    selectedElement: null,

    availableShapes: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        DRAW: 'draw',
        TEXT: 'text'
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

    
    
    $('#my-canvas').on('mousedown', function(mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
            drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorPick);
            break;
            case drawio.availableShapes.LINE:
            drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, drawio.widthPick);
            break;
            case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, drawio.widthPick);
            break;
            case drawio.availableShapes.DRAW:
            drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, drawio.widthPick);
            break;
            case drawio.availableShapes.TEXT:
            drawio.selectedElement = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.textBox, 0, 0);
            $(drawio.textBox).css({"top": mouseEvent.pageY, "left": mouseEvent.pageX});
			$(drawio.textBox).show();
            break;
        }
    });
    $('#my-canvas').on('mousemove', function(mouseEvent) {
       if (drawio.selectedElement) {
           if(drawio.selectedShape == "text") {
               $(drawio.textBox).css({"top": mouseEvent.pageY, "left": mouseEvent.pageX});
               drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
           }
           else {
            console.log(drawio.selectedElement);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
           }
        }
    });

    $('#my-canvas').on('mouseup', function(){
        drawio.shapes.push(drawio.selectedElement);
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    });
    $('#idTextBox').on('keyup', function(event){
        event.preventDefault();
        console.log('hi');
        if (event.keyCode === 13) {
            var theText = $(this).val();
            drawio.selectedElement.render(theText);
            drawio.shapes.push(theText);
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

