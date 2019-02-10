function Shape(position) {
    this.position = position;
};

Shape.prototype.render = function() {};

Shape.prototype.move = function (position) {
    this.position = position;
};

Shape.prototype.resize = function() {};

function Rectangle(position, width, height) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
};

function Line(position) {
    Shape.call(this, position);
};

function Circle(position) {
    Shape.call(this, position);
};

Rectangle.prototype = Object.create(Shape.prototype);
Line.prototype = Object.create(Shape.prototype);
Circle.prototype = Object.create(Shape.prototype);

Rectangle.prototype.constuctor = Rectangle;
Line.prototype.constuctor = Line;
Circle.prototype.constuctor = Circle;

Rectangle.prototype.render = function() {
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};
Line.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = "red";
    drawio.ctx.lineWidth = "10";
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
    drawio.ctx.stroke();
};

Circle.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.strokeStyle = "red";
    drawio.ctx.lineWidth = "10";
    drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.width) , 0, 2 * Math.PI);
    console.log(this.radius);
    drawio.ctx.stroke();
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


