
window.drawio = {
    shapes: [], // Holds all elements on the canvas
    removedShapes: [], // Undo button
    moveingShape: [], // Holds the moveing element
    arrx: [], // Holds drawing potitions
    selectedShape: 'draw',
    fontFamilyPick: 'Arial',
    isFilled: true,
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),
    paths: [], // Holds lines potitions
    colorPick: document.querySelector('.color-picker'),
    widthPick: document.querySelector('.width-picker'),
    textBox: document.getElementById('idTextBox'),
    selectedElement: null,
    isMoveing: false,
    // This is a array to stores objects in that were created by moving another object
    movedShapes: [],
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

    // this function draws the canvas..
    function drawCanvas() {
        if(drawio.selectedElement) {
            drawio.selectedElement.render();
        }

        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    }

    // This function changes which shape will be drawn next
    $('.icon').on('click', function() {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    // This function changes whether the user wants to draw stroked or filled objects
    $('.fill').on('click', function() {
        if(document.querySelector('.filled')){
            $('.fill').removeClass('filled');
            drawio.isFilled = false;
        }
        else{
            $(this).addClass('filled');
            drawio.isFilled = true;
        }
    });

    // This function undoes the last drawn object
    $('#undo').on('click', function() {
        if (drawio.shapes.length > 0) {
            // Checks if the newest object in the shapes array is object that was moved
            if (drawio.shapes[drawio.shapes.length - 1].isMoved === true) {
                let undo = drawio.shapes.pop();
                // Pushes the newest object from the movedshapes array to the front of the shapes array
                drawio.shapes.unshift(drawio.movedShapes[drawio.movedShapes.length - 1]);
                // Checks if there is one object left in the movedshapes itemsArray
                // if so it needs to push a object to the removedshapes array so that the redo function works
                if (drawio.movedShapes.length === 1) {
                  drawio.removedShapes.push(undo);
                }
                drawio.movedShapes.pop();
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
            }
            else {
              let undo = drawio.shapes.pop();
              drawio.removedShapes.push(undo);
              drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
              drawCanvas();
            }
        }
    });

    // This function redoes the last undone object
    $('#redo').on('click', function() {
        if (drawio.removedShapes.length > 0) {
          // if the newest object in the removedshapes array is a moved object, it needs to handle it differently
          if (drawio.removedShapes[drawio.removedShapes.length - 1].isMoved === true) {
            drawio.movedShapes.push(drawio.shapes[drawio.shapes.length - 1]);
            drawio.shapes.pop();
            let redo = drawio.removedShapes.pop();
            drawio.shapes.push(redo);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();
          }
          else {
            let redo = drawio.removedShapes.pop();
            drawio.shapes.push(redo);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();
          }
        }
    });

    // This function changes the font-family picked
    $('select').on('change', function () {
        drawio.fontFamilyPick = this.value;
    })

    // This function handles mousedown event. When the mouse button is down on the canvas, it creates a New
    // object according to which object is selected. It also creates a new object when a previous one is moved
    $('#my-canvas').on('mousedown', function(mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
            drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorPick, drawio.widthPick, drawio.isMoveing, drawio.isFilled, "rectangle", false);
            break;
            case drawio.availableShapes.LINE:
            drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick ,drawio.colorPick, drawio.isMoveing, "line", false);
            break;
            case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick, drawio.colorPick, drawio.isMoveing, drawio.isFilled, "circle", false);
            break;
            case drawio.availableShapes.DRAW:
            drawio.arrx = [];
            drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.widthPick, drawio.colorPick, drawio.isMoveing, drawio.arrx, "draw", false);
            break;
            case drawio.availableShapes.TEXT:
            drawio.selectedElement = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.textBox, drawio.colorPick, drawio.fontFamilyPick, drawio.widthPick, drawio.isMoveing, "text", false);
            $(drawio.textBox).css({"top": mouseEvent.pageY, "left": mouseEvent.pageX});
			      $(drawio.textBox).show();
            break;
            case drawio.availableShapes.MOVE:
            for(var i = 0; i<drawio.shapes.length; i++) {
                var x = mouseEvent.offsetX;
                var y = mouseEvent.offsetY;
                if(drawio.shapes[i].pointStroke(x, y) && drawio.shapes[i].constuctor.name == "Line") {
                    drawio.movedShapes.push(drawio.shapes[i]);
                    // drawio.movedShapes[i].isMoved = true;
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Line({ x: x, y: mouseEvent.offsetY }, calling.width, calling.height, calling.widthPick ,calling.colorPick, drawio.isMoveing, "line", true);
                    drawio.selectedElement.isMoved = true;
                }
                else if(drawio.shapes[i].pointStroke(x, y) && drawio.shapes[i].constuctor.name == "Circle" || drawio.shapes[i].pointPath(x, y) && drawio.shapes[i].constuctor.name == "Circle") {
                    drawio.movedShapes.push(drawio.shapes[i]);
                    // drawio.movedShapes[i].isMoved = true;
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.width, calling.height, calling.widthPick, calling.colorPick, drawio.isMoveing, calling.isFilled, "circle", true);
                    drawio.selectedElement.isMoved = true;
                }
                else if(drawio.shapes[i].pointStroke(x, y) && drawio.shapes[i].constuctor.name == "Draw" ) {
                    drawio.movedShapes.push(drawio.shapes[i]);
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Draw({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.width, calling.height, calling.widthPick, calling.colorPick, drawio.isMoveing, calling.arrx, "draw", true);
                    drawio.selectedElement.isMoved = true;
                }
                else if(drawio.shapes[i].pointStroke(x, y) && drawio.shapes[i].constuctor.name == "Rectangle" || drawio.shapes[i].pointPath(x, y) && drawio.shapes[i].constuctor.name == "Rectangle") {
                    drawio.movedShapes.push(drawio.shapes[i]);
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX , y: mouseEvent.offsetY }, calling.width, calling.height, calling.colorPick, calling.widthPick, drawio.isMoveing, calling.isFilled, "rectangle", true);
                    drawio.selectedElement.isMoved = true;
                }
                else if(drawio.shapes[i].textSize(x, y) && drawio.shapes[i].constuctor.name == "Text" ) {
                    drawio.movedShapes.push(drawio.shapes[i]);
                    drawio.moveingShape = drawio.shapes.splice(i, 1);
                    var calling = drawio.moveingShape[drawio.moveingShape.length -1];
                    drawio.isMoveing = true;
                    drawio.selectedElement = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, calling.textBox, calling.colorPick, calling.fontFamilyPick, calling.widthPick, drawio.isMoveing, "text", true);
                    drawio.selectedElement.isMoved = true;
                }
            }
            break;
        }
    });

    // This function will resize the object when mouse is moved and calls the drawing function
    $('#my-canvas').on('mousemove', function(mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    // On mouseup this function will push the object to the shapes array
    $('#my-canvas').on('mouseup', function(){
        if(drawio.selectedElement) {
            drawio.isMoveing = false;
            drawio.selectedElement.isMoveing = false;
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement = null;
        }
    });

    // This function will make sure that the text will be drawn when the user presses enter
    $('#idTextBox').on('keyup', function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            if($(this).val()) {
                drawio.selectedElement.textBox = $(this).val();
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawio.selectedElement.resize(event.offsetX, event.offsetY);
                drawCanvas();
                drawio.shapes.push(drawio.selectedElement);
                drawio.selectedElement = null;
                $("#idTextBox").val('');
	            $("#idTextBox").hide();
            }
            else {
                $("#idTextBox").hide();
            }
        }
    });

    // This is the funtion that will convert all the javascrip objects from the LocalStorage to their original shapes on the canvas
    function convertToShapes(itemList) {
        for (i = 0; i < itemList.length; i++) {
          if(itemList[i].name === 'rectangle') {
            drawio.shapes.push(new Rectangle({ x: itemList[i].position.x , y: itemList[i].position.y }, itemList[i].width, itemList[i].height, itemList[i].colorPick, itemList[i].widthPick, itemList[i].isMoveing, itemList[i].isFilled, itemList[i].name))
          }
          else if(itemList[i].name === 'circle') {
            drawio.shapes.push(new Circle({ x: itemList[i].position.x, y: itemList[i].position.y }, itemList[i].width, itemList[i].height, itemList[i].widthPick, itemList[i].colorPick, itemList[i].isMoveing, itemList[i].isFilled, itemList[i].name))
          }
          else if(itemList[i].name === 'draw') {
            var draw = new Draw({ x: itemList[i].position.x, y: itemList[i].position.y }, itemList[i].width, itemList[i].height, itemList[i].widthPick, itemList[i].colorPick, itemList[i].isMoveing, itemList[i].name);
            draw.arrx = itemList[i].arrx;
            draw.pathLine = itemList[i].pathLine;
            drawio.shapes.push(draw);
          }
          else if(itemList[i].name === 'text') {
            var theText = new Text({ x: itemList[i].position.x, y: itemList[i].position.y }, itemList[i].textBox, itemList[i].colorPick, itemList[i].fontFamilyPick, itemList[i].widthPick, itemList[i].isMoveing, itemList[i].name);
            theText.pathLine = itemList[i].pathLine;
            drawio.shapes.push(theText);
          }
          else if(itemList[i].name === 'line') {
            var line = new Line({ x: itemList[i].position.x, y: itemList[i].position.y }, itemList[i].width, itemList[i].height, itemList[i].widthPick ,itemList[i].colorPick, itemList[i].isMoveing, itemList[i].name);
            line.pathLine = itemList[i].pathLine;
            drawio.shapes.push(line);
          }
        }
    }

    // These are all for the localstorage
    const form = document.querySelector('form');
    const selectCanvas = document.getElementsByClassName('select');
    const option = document.querySelector('option');
    const button = document.getElementById('clear');
    const input = document.getElementById('item');
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    localStorage.setItem('items', JSON.stringify(itemsArray));
    const data = JSON.parse(localStorage.getItem('items'));

    // Creates all the options in the select list of the canvases
    const liMaker = (text) => {
        const option = document.createElement('option');
        option.text = text;
        option.value = text;
        selectCanvas[0].appendChild(option);
    }
    // This button is for saving the current canvas to the localstorage
    $('#save-canvas').on('click', function(e) {
        // Checks if the input already exists
        for (i = 0; i < itemsArray.length; i++) {
          if (itemsArray[i] === input.value) {
            // Don't erase this alert!!
            alert("This name already exists!")
            return;
          }
        }
        // Checks if the input is not empty
        if (input.value) {
          itemsArray.push(input.value);
          localStorage.setItem('items', JSON.stringify(itemsArray));
          localStorage.setItem(input.value, JSON.stringify(drawio.shapes));
          liMaker(input.value);
          input.value = "";
        }
        else {
          // Don't erase this alert!!
          alert("You must give the canvas a name before saving!");
        }
    })

    // Makes sure that the list of available saves canvases gets printed out when the page loads
    data.forEach(item => {
        liMaker(item);
    });

    button.addEventListener('click', function () {
        localStorage.clear();
        selectCanvas[0].options.length = 0;

        itemsArray = [];
    });

    // This button is for getting the selected saved canvas from the localstorage
    $('#retrieve-localstorage').on('click', function(e) {
      // Checks if there is something saved in the localstorage
        var selectedCanvas = $(".select :selected").text();
        if(localStorage.getItem(selectedCanvas)) {
          var items =  JSON.parse(localStorage.getItem(selectedCanvas));
          // converts the items to their previous shapes
          convertToShapes(items);
          drawCanvas();
        }
    })
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
