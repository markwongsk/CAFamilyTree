// CA Family tree

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var MINIMAL_SPACING = 35;
var VERTICAL_SPACING = 50;

function drawFamilyTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    activeCAs = repositionCAs(semesterToCAs);
    for (s = 0; s < SEMESTER_NOW; s++) {
        for (i = 0; i < activeCAs[s].length; i ++) {
            drawNode(activeCAs[s][i].pos[0], activeCAs[s][i].pos[1],
                    activeCAs[s][i].name);
        }
    }
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

function repositionCAs(semesterToCAs) {
    activeCAs = {};
    for (s = 0; s < SEMESTER_NOW; s++) {
        activeCAs[s] = [];
        j = 0
        for (i = 0; i < semesterToCAs[s].length; i ++) {
            if (semesterToCAs[s][i].active) {
                activeCAs[s][j].push(semesterToCAs[s][i]);
                j ++;
            }
        }
        spacing = canvas.width/(activeCAs[s].length+1);
        if (spacing < MINIMAL_SPACING) {
            resize(canvas.width*2, canvas.height*2);
            return;
        }
        for (i = 0; i < activeCAs[s].length; i++) {
            activeCAs[s][i].pos = [spacing*(i+1), (s+1)*VERTICAL_SPACING];
        }
    }
    return activeCAs;
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

