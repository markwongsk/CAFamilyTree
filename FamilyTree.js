// CA Family tree

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var MINIMAL_SPACING = 35;
var VERTICAL_SPACING = 50;
var SEMESTER_NOW = 8;
var TEXT_HEIGHT = 30;

function drawFamilyTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var activeCAs = repositionCAs(semesterToCA);
    for (var s = 0; s < SEMESTER_NOW; s++) {
        for (var i = 0; i < activeCAs[s].length; i ++) {
            drawConnections(activeCAs[s][i]);
        }
    }
    for (var s = 0; s < SEMESTER_NOW; s++) {
        for (var i = 0; i < activeCAs[s].length; i ++) {
            drawNode(activeCAs[s][i].pos[0], activeCAs[s][i].pos[1],
                    activeCAs[s][i]);
        }
    }
}

function drawConnections(ca) {
    for (var i = 0; i < ca.children.length; i ++) {
        if (ca.children[i].active) {
            drawSegment(ca.pos[0], ca.pos[1],
                        ca.children[i].pos[0],
                        ca.children[i].pos[1]);
        }
    }
}

function drawSegment(x1, y1, x2, y2) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawNode(x, y, ca) {
    var bbox = getbBox(ca);
    ctx.rect(bbox.left, bbox.top, bbox.width, bbox.height);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = TEXT_HEIGHT+"px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(ca.andrewid, x, y);
}

function repositionCAs(semesterToCAs) {
    var activeCAs = {};
    for (var s = 0; s < SEMESTER_NOW; s++) {
        activeCAs[s] = [];
        for (var i = 0; i < semesterToCAs[s].length; i ++) {
            if (semesterToCAs[s][i].active) {
                activeCAs[s].push(semesterToCAs[s][i]);
            }
        }
        var spacing = canvas.width/(activeCAs[s].length+1);
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
    drawFamilyTree();
}

var semesterToCA = {};

for (var i = 0; i < SEMESTER_NOW; i++) {
  semesterToCA[i] = [];
}

function CA(andrewid, children, pos, semester, active) {
  this.andrewid = andrewid;
  this.children = children;
  this.pos = pos;
  this.semester = semester;
  semesterToCA[semester].push(this);
  this.active = (active === undefined ? false : active);
}

function bBox(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.height = bottom-top;
  this.width = right-left;
}

function getbBox(ca) {
  var text = ca.andrewid;
  console.log(text);
  var measure = ctx.measureText(text);
  console.log(measure.width);
  var cx = ca.pos[0];
  var cy = ca.pos[1];
  return new bBox(cx-measure.width/2, cy-TEXT_HEIGHT,
              cx+measure.width/2, cy);
}

function getCAAtCoord(x,y) {
  for (var semester in semesterToCA) {
    for (var i = 0; i < semesterToCA[semester].length; i++) {
      var ca = semesterToCA[semester][i];
      var bbox = getbBox(ca);
      if (x >= bbox.left && x <= bbox.right &&
          y >= bbox.top && y <= bbox.bottom) {
        return semesterToCA[semester][ca];
      }
    }
  }
  return null;
}

function onMouseDown(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;

  console.log("Clicked at: (" + x + "," + y + ")");
  ca = getCAAtCoord(x,y);

  if (ca !== null) {
    console.log("You clicked: " + ca.andrewid);
  }
}

canvas.addEventListener('mousedown', onMouseDown, false);

// cagraph represents the dag of mentor-mentee relationship
//
// andrewid - the andrewid of this ca
// children - a list of students ever taught by this ca
// pos - the position that the 
asdf = new CA("asdf", [], [0,0], 1, true);
yeah = new CA("yeah", [], [0,0], 1, true);
kelly = new CA("krivers", [asdf, yeah], [0,0], 0, true);

drawFamilyTree();

