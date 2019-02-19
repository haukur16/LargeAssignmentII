function Shape(position, name) {
    this.position = position;
    this.name = name;
};

Shape.prototype.render = function() {};
Shape.prototype.move = function (position) {
    this.position = position;
};
Shape.prototype.resize = function() {};

Shape.prototype.pointStroke = function(theX, theY) {
    console.log(drawio.ctx.isPointInStroke(this.pathLine, theX, theY));
    return drawio.ctx.isPointInStroke(this.pathLine, theX, theY);
};
Shape.prototype.textSize = function(theX, theY) {
    if(this.constuctor.name == "Text") {
        var startX = this.position.x;
        var endX = this.position.x + (this.widthPick * this.textBox.length/2);
        var startY = this.position.y - this.widthPick;
        var endY= this.position.y;
        if((startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY)) {
            return (startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY);
        }
    }
};

function Rectangle(position, width, height, colorPick, widthPick, isMoveing, name) {
    Shape.call(this, position, name);
    this.width = width;
    this.height = height;
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
    this.isMoveing = isMoveing;
    this.pathLine;
};
function Line(position, width, height, widthPick, colorPick, isMoveing, name) {
    Shape.call(this, position, name);
    this.width = width;
    this.height = height;
    this.widthPick = widthPick.value;
    this.colorPick = colorPick.value;
    this.isMoveing = isMoveing;
    this.pathLine;
};
function Circle(position, width, height, widthPick, colorPick, isMoveing, name) {
    Shape.call(this, position, name);
    this.width = width;
    this.height = height;
    this.widthPick = widthPick.value;
    this.colorPick = colorPick.value;
    this.isMoveing = isMoveing;
    this.pathLine;
};
function Draw(position, width, height, widthPick, colorPick, isMoveing, arrx, name) {
    Shape.call(this, position, name);
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
    this.isMoveing = isMoveing;
    this.width = width;
    this.height = height;
    this.arrx = arrx;
    this.pathLine;
};
function Text(position, textBox, colorPick, fontFamilyPick, widthPick, isMoveing, name) {
    Shape.call(this, position, name);
    this.textBox = textBox;
    this.colorPick = colorPick.value;
    this.fontFamilyPick = fontFamilyPick;
    this.widthPick = widthPick.value;
    this.isMoveing = isMoveing;
    this.pathLine;
}




Rectangle.prototype = Object.create(Shape.prototype);
Line.prototype = Object.create(Shape.prototype);
Circle.prototype = Object.create(Shape.prototype);
Draw.prototype = Object.create(Shape.prototype);
Text.prototype = Object.create(Shape.prototype);


Rectangle.prototype.constuctor = Rectangle;
Line.prototype.constuctor = Line;
Circle.prototype.constuctor = Circle;
Draw.prototype.constuctor = Draw;
Text.prototype.constuctor = Text;


Rectangle.prototype.render = function() {
    this.pathLine = new Path2D;
    drawio.ctx.fillStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    this.pathLine.rect(this.position.x, this.position.y, this.width, this.height);
    drawio.ctx.stroke(this.pathLine);
    drawio.paths.push(this.pathLine);
};
Line.prototype.render = function() {
    this.pathLine = new Path2D();
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    this.pathLine.moveTo(this.position.x, this.position.y);
    this.pathLine.lineTo(this.position.x + this.width, this.position.y + this.height);
    drawio.ctx.stroke(this.pathLine);
    drawio.ctx.closePath();
    drawio.paths.push(this.pathLine);
};
Circle.prototype.render = function() {
    this.pathLine = new Path2D();
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    this.pathLine.arc(this.position.x, this.position.y, Math.abs(this.width) , 0, 2 * Math.PI);
    drawio.ctx.stroke(this.pathLine);
    drawio.paths.push(this.pathLine);
};
Draw.prototype.render = function() {
    alert("drawing");
    if(this.isMoveing){
        this.pathLine = new Path2D();
        var movedDraw = [];
        drawio.ctx.beginPath();
        drawio.ctx.strokeStyle = this.colorPick;
        drawio.ctx.lineWidth = this.widthPick;
        this.pathLine.moveTo(this.position.x, this.position.y);
        for(var i = 0; i<this.arrx.length; i++) {
            var x = this.position.x - (this.arrx[0].x-this.arrx[i].x);
            var y = this.position.y - (this.arrx[0].y-this.arrx[i].y);
            this.pathLine.lineTo(x, y);
            movedDraw.push({x: x , y: y});
        }
        drawio.ctx.stroke(this.pathLine);
        drawio.ctx.closePath();
        drawio.paths.push(this.pathLine);
        this.arrx = movedDraw;
    }
    else {
        this.pathLine = new Path2D();
        drawio.ctx.beginPath();
        drawio.ctx.strokeStyle = this.colorPick;
        drawio.ctx.lineWidth = this.widthPick;
        this.pathLine.moveTo(this.position.x, this.position.y);
        for(var i = 0; i<this.arrx.length; i++) {
            var x = this.arrx[i].x;
            var y = this.arrx[i].y;
            this.pathLine.lineTo(x, y);
        }
        drawio.ctx.stroke(this.pathLine);
        drawio.ctx.closePath();
        drawio.paths.push(this.pathLine);
    }

};
Text.prototype.render = function() {
    this.pathLine = new Path2D();
    drawio.ctx.font = this.widthPick + 'px ' + this.fontFamilyPick;
    drawio.ctx.fillStyle = this.colorPick;
    drawio.ctx.fillText(this.textBox, this.position.x, this.position.y);
    drawio.ctx.stroke(this.pathLine);
    drawio.paths.push(this.pathLine);
};




Rectangle.prototype.resize = function (x, y) {
    if(this.isMoveing) {
        this.position.x = x;
        this.position.y = y;
        this.width = this.width ;
        this.height = this.height;

    }
    else {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }

};
Line.prototype.resize = function (x, y) {
    if(this.isMoveing) {
        this.position.x = x;
        this.position.y = y;
        this.width = this.width ;
        this.height = this.height;

    }
    else {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
};
Circle.prototype.resize = function (x, y) {
    if(this.isMoveing) {
        this.position.x = x;
        this.position.y = y;
        this.width = this.width;
        this.height = this.height;
    }
    else{
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
};
Draw.prototype.resize = function (x, y) {
    if(this.isMoveing) {
        this.arrx = this.arrx;
        this.width = this.width;
        this.height = this.height;
        this.position.x = x;
        this.position.y = y;

    }
    else {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
        this.arrx.push({x: x , y: y});
    }
};
Text.prototype.resize = function (x, y) {
    if(this.isMoveing) {
        this.textBox = this.textBox;
        this.position.x = x;
        this.position.y = y;
    }
    else {
        this.textBox = drawio.textBox.value;
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
};
