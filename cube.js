/*
          5                       7
           * * * * * * * * * * * * 
          **                    **
       1 * *                 3 * *
        * * * * * * * * * * * *  *
        *  *                  *  *
        *  *                  *  *
        *  *                  *  *
        *  * 4                *  *
        *  * * * * * * * * * **  * 6
        * *                   * *
        **                    **
        * * * * * * * * * * * * 
       0                       2
*/

var MAX_ROTATION_ANGLE = Math.PI / 60;
var rotationX = MAX_ROTATION_ANGLE;
var rotationY = MAX_ROTATION_ANGLE;

var width = window.innerWidth;
var height = window.innerHeight;
var fullRule = 200;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var center = {x : width / 2, y : height / 2};

var points = [
    { x: -fullRule / 2, y: -fullRule / 2, z: fullRule / 2 },
    { x: -fullRule / 2, y: fullRule / 2, z: fullRule / 2 },
    { x: fullRule / 2, y: -fullRule / 2, z: fullRule / 2 },
    { x: fullRule / 2, y: fullRule / 2, z: fullRule / 2 },

    { x: -fullRule / 2, y: -fullRule / 2, z: -fullRule / 2 },
    { x: -fullRule / 2, y: fullRule / 2, z: -fullRule / 2 },
    { x: fullRule / 2, y: -fullRule / 2, z: -fullRule / 2 },
    { x: fullRule / 2, y: fullRule / 2, z: -fullRule / 2 }
]

function Cube(points){
    this.points = points;
    this.faceset = [];
    this.faceset.push(new Face(points[0], points[1], points[3], points[2]));
    this.faceset.push(new Face(points[1], points[5], points[7], points[3]));
    this.faceset.push(new Face(points[5], points[4], points[6], points[7]));
    this.faceset.push(new Face(points[4], points[0], points[2], points[6]));
    this.faceset.push(new Face(points[1], points[5], points[4], points[0]));
    this.faceset.push(new Face(points[3], points[7], points[6], points[2]));
}

function Face(point1, point2, point3, point4){
    this.vector = [];
    for (var i = 0; i < arguments.length; i++) {
        this.vector.push(new Vector(arguments[i]));
    }
}
Face.prototype.draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.vector[0].getAxis2D().x, this.vector[0].getAxis2D().y);
    for (var i = 1; i < this.vector.length; i++) {
        ctx.lineTo(this.vector[i].getAxis2D().x, this.vector[i].getAxis2D().y);
    }
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
}

function Vector(point){
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
}
Vector.prototype = {
    FOCUS_POSITION: 500,
    rotateX: function(angle){
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var y = this.y * cos - this.z * sin;
        var z = this.z * cos + this.y * sin;
        this.y = y;
        this.z = z;
    },
    rotateY: function(angle){
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = this.x * cos - this.z * sin;
        var z = this.z * cos + this.x * sin;
        this.x = x;
        this.z = z;
    },
    rotateZ: function(angle){
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = this.x * cos - this.y * sin;
        var y = this.y * cos + this.x * sin;
        this.x = x;
        this.y = y;
    },
    getAxis2D: function(){
        var scale = this.FOCUS_POSITION / (this.FOCUS_POSITION + this.z);
        return {x : center.x + this.x * scale, y : center.y - this.y * scale};
    }
}

function changeAngle(ev){
    var x = ev.clientX + document.documentElement.scrollTop || document.body.scrollTop,
        y = ev.clientY + document.documentElement.scrollLeft || document.body.scrollLeft;

    rotationX = (center.y - y) / center.y * MAX_ROTATION_ANGLE;
    rotationY = (center.x - x) / center.x * MAX_ROTATION_ANGLE;

    console.log(rotationX + ',' + rotationY);
}

function dDraw(){
    for (var i = 0; i < cubeIs.faceset.length; i++) {
        cubeIs.faceset[i].draw();
    }

    for (var i = 0; i < cubeIs.faceset.length; i++) {
        for (var j = 0; j < cubeIs.faceset[i].vector.length; j++) {
            cubeIs.faceset[i].vector[j].rotateX(rotationX);
            cubeIs.faceset[i].vector[j].rotateY(rotationY);
        }
    }
}
function animate(){
    ctx.clearRect(0, 0, width, height);
    dDraw();
    requestAnimationFrame(animate);
}

var cubeIs = new Cube(points);
canvas.addEventListener('mousemove', changeAngle);
animate();
