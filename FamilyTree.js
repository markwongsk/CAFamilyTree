// CA Family tree

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");



function drawFamilyTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNode(canvas.width/2,50, "CA 1");
    drawSegment(canvas.width/2, 50, canvas.width/3,75);
    drawNode(canvas.width/3,100, "CA 1");
    drawSegment(canvas.width/2, 50, 2*canvas.width/3,75);
    drawNode(2*canvas.width/3,100, "CA 1");
}

function drawSegment(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawNode(x, y, value) {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value, x, y);
}

function resize(width, height) {
    canvas.width = width;
    canvas.height = height;
}

drawFamilyTree();
setTimeout(function() {
    resize(750,750);
    drawFamilyTree();
}, 5000);

