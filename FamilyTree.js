var SEMESTER_NOW = 8;
// CAGraph represents the DAG of mentor-mentee relationship
//
// andrewid - the andrewid of this CA
// children - a list of students ever taught by this CA
// pos - the position that the 
var CAGraph = CA(Kelly, [], (canvas.width/2, 10), 0);
var semesterToCA = {};

for (var i = 0; i < SEMESTER_NOW; i++) {
  semesterToCA[i] = [];
}

function CA(andrewid, children, pos, semester) {
  this.andrewid = andrewid;
  this.children = children;
  this.pos = pos;
  this.semester = semester;
  semesterToCA[semester].push(this);
  this.active = false;
}

function Bbox(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
}

function getBbox(CA) {
  var text = CA.andrewid;
  var measure = ctx.measureText(text);
  var cx = CA.pos[0];
  var cy = CA.pos[1];
  return Bbox(cx-measure.width/2, cy-measure.height/2,
              cx+measure.width/2, cy+measure.height/2)
}

function getCAAtCoord(x,y) {
  for (var semester in semesterToCA) {
    for (var CA in semesterToCA[semester]) {
      var bbox = getBbox(CA);
      if (x >= bbox.left && x <= bbox.right &&
          y >= bbox.top && y <= bbox.bottom) {
        return CA;
      }
    }
  }
  return new Object();
}

function onMouseDown(event) {
  var x = event.pageX - canavs.offsetLeft;
  var y = event.pageY - canvas.offsetTop;

  ca = getCAAtCoord(x,y);
}

canvas.addEventListener('mousedown', onMouseDown, false);

