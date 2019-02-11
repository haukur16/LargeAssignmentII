function Shape(position) {
    this.position = position;
};

Shape.prototype.render = function() {};
Shape.prototype.move = function (position) {
    this.position = position;
};
Shape.prototype.resize = function() {};

function Rectangle(position, width, height, colorPick) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.colorPick = colorPick.value;
};
function Line(position, colorPick, widthPick) {
    Shape.call(this, position);
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
};
function Circle(position, colorPick, widthPick) {
    Shape.call(this, position);
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
};
function Draw(position, colorPick, widthPick) {
    Shape.call(this, position);
    this.colorPick = colorPick.value;
    this.widthPick = widthPick.value;
    this.arrx = [];
};
function Text(position, textBox, width, height) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.textBox = textBox.value;

    console.log(this.position.x, this.position.y)
    
};


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
    
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = this.colorPick;
    drawio.ctx.lineWidth = this.widthPick;
    drawio.ctx.moveTo(this.position.x, this.position.y);
    for(var i = 1; i<this.arrx.length; i++) {
        var x = this.arrx[i].x;
        var y = this.arrx[i].y;
        drawio.ctx.lineTo(x, y);
    }
    drawio.ctx.stroke();
    drawio.ctx.closePath();
};
Text.prototype.render = function(theText) {
    drawio.ctx.font = "30px Arial";
    drawio.ctx.fillText(theText, this.position.x, this.position.y);
};

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};
Line.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};
Circle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};
Draw.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
    this.arrx.push({x: x , y: y});
};
Text.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};


