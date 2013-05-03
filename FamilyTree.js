// CA Family tree

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var MINIMAL_SPACING = 35;
var VERTICAL_SPACING = 50;
var SEMESTER_NOW = 8;

// CA class
// 
// andrewid - the andrewid of the CA
// children - a list of children this CA taught
// pos - the position this CA's name will be drawn
//       (anchored at south)
// semester - the semester the CA first CAed
// active - whether this CA is being displayed 
function CA(andrewid, children, pos, semester, active) {
  this.andrewid = andrewid;
  this.children = children;
  this.pos = pos;
  this.semester = semester;
  semesterToCA[semester].push(this);
  this.active = (active === undefined ? false : active);

}

// gets the bounding box for where this CA's name is being drawn
CA.prototype.getBBox = function() {
  var measure = ctx.measureText(andrewid);
  console.log("Getting bbox of: " + ca);
  var cx = ca.pos[0];
  var cy = ca.pos[1];
  return new bBox(cx-measure.width/2, cy-2*VERTICAL_SPACING/3,
                  cx+measure.width/2, cy)
}

// adds a child to the list of children this CA has
CA.prototype.addChild = function(child) {
  this.children.push(child);
}

// BBox class
function bBox(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
}

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
                    activeCAs[s][i].andrewid);
        }
    }
}

function drawConnections(ca) {
    console.log(ca.children.length);
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

function drawNode(x, y, value) {
    var w = ctx.measureText(value);
    console.log("Drawing: " + value + " at (" + x + "," + y + ")");
    ctx.rect(x-w.width/2,y-2*VERTICAL_SPACING/3, w.width,2*VERTICAL_SPACING/3);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value, x, y);
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
}

var semesterToCA = {};

for (var i = 0; i < SEMESTER_NOW; i++) {
  semesterToCA[i] = [];
}

function getbBox(ca) {
  var text = ca.andrewid;
  var measure = ctx.measureText(text);
  console.log("Getting bbox of: " + ca);
  var cx = ca.pos[0];
  var cy = ca.pos[1];
  return new bBox(cx-measure.width/2, cy-2*VERTICAL_SPACING/3,
              cx+measure.width/2, cy)
}

function getCAAtCoord(x,y) {
  console.log (semesterToCA);
  for (var semester in semesterToCA) {
    for (var i = 0; i < semesterToCA[semester].length; i++) {
      var ca = semesterToCA[semester][i];
      console.log(ca);
      var bbox = getbBox(ca);
      console.log(bbox);
      if (x >= bbox.left && x <= bbox.right &&
          y >= bbox.top && y <= bbox.bottom) {
        return ca;
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
    for (var i = 0; i < ca.children.length; i++) {
      ca.children[i].active = true;
    }
  }

  drawFamilyTree();
}

canvas.addEventListener('mousedown', onMouseDown, false);

// cagraph represents the dag of mentor-mentee relationship
//
// andrewid - the andrewid of this ca
// children - a list of students ever taught by this ca
// pos - the position that the 
asdf = new CA("asdf", [], [0,0], 1, false);
yeah = new CA("yeah", [], [0,0], 1, false);
kelly = new CA("krivers", [asdf, yeah], [0,0], 0, true);

drawFamilyTree();

