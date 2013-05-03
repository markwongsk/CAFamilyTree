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

var semestertoca = {};

for (var i = 0; i < semester_now; i++) {
  semestertoca[i] = [];
}

function ca(andrewid, children, pos, semester, active = false) {
  this.andrewid = andrewid;
  this.children = children;
  this.pos = pos;
  this.semester = semester;
  semestertoca[semester].push(this);
  this.active = active;
}

function bbox(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
}

function getbbox(ca) {
  var text = ca.andrewid;
  var measure = ctx.measuretext(text);
  var cx = ca.pos[0];
  var cy = ca.pos[1];
  return bbox(cx-measure.width/2, cy-measure.height/2,
              cx+measure.width/2, cy+measure.height/2)
}

function getcaatcoord(x,y) {
  for (var semester in semestertoca) {
    for (var ca in semestertoca[semester]) {
      var bbox = getbbox(ca);
      if (x >= bbox.left && x <= bbox.right &&
          y >= bbox.top && y <= bbox.bottom) {
        return ca;
      }
    }
  }
  return null;
}

function onmousedown(event) {
  var x = event.pagex - canavs.offsetleft;
  var y = event.pagey - canvas.offsettop;

  ca = getcaatcoord(x,y);

  if (ca != null) {
    console.log("You clicked: " + ca.name);
  }
}

canvas.addeventlistener('mousedown', onmousedown, false);

var semester_now = 8;
// cagraph represents the dag of mentor-mentee relationship
//
// andrewid - the andrewid of this ca
// children - a list of students ever taught by this ca
// pos - the position that the 
var cagraph = ca(kelly, [], (canvas.width/2, 10), 0, true);

drawFamilyTree();
setTimeout(function() {
    resize(750,750);
    drawFamilyTree();
}, 5000);


