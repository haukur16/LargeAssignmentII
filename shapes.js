function Shape(position) {
    this.position = position;
};

Shape.prototype.render = function() {};
Shape.prototype.move = function (position) {
    this.position = position;
};
Shape.prototype.resize = function() {};

Shape.prototype.rectaSize = function(theX, theY) {
    if(this.width >= 0 && this.height >= 0){
    return (this.position.x <= theX) &&
            (this.position.x + this.width >= theX) &&
            (this.position.y <= theY) &&
            (this.position.y + this.height >= theY)
    }
    else if(this.width < 0 && this.height < 0){
        return (this.position.x >= theX) &&
        (this.position.x + this.width <= theX) &&
        (this.position.y >= theY) &&
        (this.position.y + this.height <= theY)
    }
    else if(this.width >= 0 && this.height < 0){
        return (this.position.x <= theX) &&
        (this.position.x + this.width >= theX) &&
        (this.position.y >= theY) &&
        (this.position.y + this.height <= theY)
    }
    else if(this.width < 0 && this.height >= 0){
        return (this.position.x >= theX) &&
        (this.position.x + this.width <= theX) &&
        (this.position.y <= theY) &&
        (this.position.y + this.height >= theY)
    }
};
Shape.prototype.drawSize = function(theX, theY) {
    if(this.constuctor.name == "Draw") {
        for(var i = 1; i<this.arrx.length; i++) {
        var startX = this.arrx[i].x - this.widthPick/2;
        var endX = this.arrx[i].x + this.widthPick/2;
        var startY = this.arrx[i].y - this.widthPick/2;
        var endY= this.arrx[i].y + this.widthPick/2;
        if((startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY)) {
            return (startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY);
        }
    }
    }
};
Shape.prototype.circleSize = function(theX, theY) {
    if(this.constuctor.name == "Circle") {
        var startX = this.position.x - this.width;
        var endX = this.position.x + this.width;
        var startY = this.position.y - this.height;
        var endY= this.position.y + this.height;
        if((startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY)) {
            return (startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY);
        }
    }
};

Shape.prototype.textSize = function(theX, theY) {
    if(this.constuctor.name == "Text") {
        var startX = this.position.x;
        console.log(startX);
        var endX = this.position.x + (this.widthPick * this.textBox.length/2);
        console.log(endX);
        var startY = this.position.y - this.widthPick;
        console.log(startY);
        var endY= this.position.y;
        console.log(endY);
        if((startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY)) {
            return (startX <= theX) && (endX >= theX) && (startY <= theY) && (endY >= theY);
        }
    }
};

function Rectangle(position, width, height, colorPick, isMoveing) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.colorPick = colorPick.value;
    this.isMoveing = isMoveing;
};
function Line(position, width, height, widthPick, colorPick, isMoveing) {
    Shape.call(this, position);
    this.width = width.value;
    this.height = height;
    this.widthPick = widthPick.value;
    this.colorPick = colorPick.value;
    this.isMoveing = isMoveing;
};
function Circle(position, width, height, widthPick, colorPick, isMoveing) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.widthPick = widthPick.value;
    this.colorPick = colorPick.value;
    this.isMoveing = isMoveing;
};
function Draw(position, width, height, widthPick, colorPick, isMoveing, arrx) {
    Shape.call(this, position);
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
    this.isMoveing = isMoveing;
    this.width = width;
    this.height = height;
    this.arrx = arrx;
};
function Text(position, textBox, colorPick, fontFamilyPick, widthPick, isMoveing) {
    Shape.call(this, position);
    this.textBox = textBox;
    this.colorPick = colorPick.value;
    this.fontFamilyPick = fontFamilyPick;
    this.widthPick = widthPick.value;
    this.isMoveing = isMoveing;
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
    drawio.ctx.fillStyle = this.colorPick;
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    
};
Line.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
    drawio.ctx.stroke();
};
Circle.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.width) , 0, 2 * Math.PI);
    drawio.ctx.stroke();
};
Draw.prototype.render = function() {
    if(this.isMoveing){
        var movedDraw = [];
        drawio.ctx.beginPath();
        drawio.ctx.strokeStyle = this.colorPick;
        drawio.ctx.lineWidth = this.widthPick;
        drawio.ctx.moveTo(this.position.x, this.position.y);
        for(var i = 0; i<this.arrx.length; i++) {
            var x = this.position.x - (this.arrx[0].x-this.arrx[i].x);
            var y = this.position.y - (this.arrx[0].y-this.arrx[i].y);
            drawio.ctx.lineTo(x, y);
            movedDraw.push({x: x , y: y});
        }
        drawio.ctx.stroke();
        drawio.ctx.closePath();
        this.arrx = movedDraw;
    }
    else {
        drawio.ctx.beginPath();
        drawio.ctx.strokeStyle = this.colorPick;
        drawio.ctx.lineWidth = this.widthPick;
        drawio.ctx.moveTo(this.position.x, this.position.y);
        for(var i = 0; i<this.arrx.length; i++) {
            var x = this.arrx[i].x;
            var y = this.arrx[i].y;
            drawio.ctx.lineTo(x, y);
        }
        drawio.ctx.stroke();
        drawio.ctx.closePath();
    }

};
Text.prototype.render = function() {
    drawio.ctx.font = this.widthPick + 'px ' + this.fontFamilyPick;
    drawio.ctx.fillStyle = this.colorPick;
    drawio.ctx.fillText(this.textBox, this.position.x, this.position.y);
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
    this.width = x - this.position.x;
    this.height = y - this.position.y;
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
