
window.drawio = {
    shapes: [],
    selectedShape: 'draw',
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),
    colorPick: document.querySelector('.color-picker'),
    selectedElement: null,

    availableShapes: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        DRAW: 'draw'
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
            drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, 0);
            break;
            case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, 0);
            break;
            case drawio.availableShapes.DRAW:
            drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorPick, 0);
            break;
    
        }
    });
    $('#my-canvas').on('mousemove', function(mouseEvent) {
       if (drawio.selectedElement) {
            console.log(drawio.selectedElement);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    $('#my-canvas').on('mouseup', function(){
        drawio.shapes.push(drawio.selectedElement);
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    })
});