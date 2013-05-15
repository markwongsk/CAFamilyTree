// CA Family tree

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var TEXT_HEIGHT = 30;
var MINIMAL_SPACING = 150;
var VERTICAL_SPACING = 50;
var SEMESTER_NOW = 15;

ctx.font = TEXT_HEIGHT+"px Arial";
// CA class
// 
// andrewid - the andrewid of the CA
// children - a list of children this CA taught
// pos - the position this CA's name will be drawn
//       (anchored at south)
// semester - the semester the CA first CAed
// activeCount - the number of active references to this CA
function CA(andrewid, children, pos, semester, activeCount) {
  this.andrewid = andrewid;
  this.children = children;
  this.pos = pos;
  this.semester = semester;
  semesterToCA[semester].push(this);
  this.activeCount = (activeCount === undefined ? 0 : activeCount);
  this.clicked = false;
}

// gets the bounding box for where this CA's name is being drawn
CA.prototype.getBBox = function() {
  var measure = ctx.measureText(this.andrewid);
  console.log("Getting bbox of: " + this.andrewid);
  var cx = this.pos[0];
  var cy = this.pos[1];
  return new BBox(cx-measure.width/2, cy-TEXT_HEIGHT,
                  cx+measure.width/2, cy)
}

// adds a child to the list of children this CA has
CA.prototype.addChild = function(child) {
  this.children.push(child);
}

// adds children to the list of children this CA has
CA.prototype.addChildren = function(children) {
  console.log("Adding a children!");
  this.children = this.children.concat(children);
  console.log("New children list is!");
  console.log(this);
}

// BBox class
function BBox(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.width = right-left;
  this.height = bottom-top;
}

function drawFamilyTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("In draw family tree!");
    var activeCAs = repositionCAs(semesterToCA);
    for (var s = 0; s < SEMESTER_NOW; s++) {
        for (var i = 0; i < activeCAs[s].length; i ++) {
            drawConnections(activeCAs[s][i]);
        }
    }
    for (var s = 0; s < SEMESTER_NOW; s++) {
        for (var i = 0; i < activeCAs[s].length; i ++) {
            drawNode(activeCAs[s][i]);
        }
    }
}

function drawConnections(ca) {
    console.log(ca.children.length);
    for (var i = 0; i < ca.children.length; i ++) {
        if (ca.children[i].activeCount > 0) {
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

function drawNode(ca) {
    var bbox = ca.getBBox();
    console.log("Drawing: " + ca.andrewid + " at (" + ca.pos[0] + "," + ca.pos[1] + ")");
    ctx.rect(bbox.left, bbox.top, bbox.width, bbox.height);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(ca.andrewid, ca.pos[0], ca.pos[1]);
}

function repositionCAs(semesterToCA) {
    var activeCAs = {};
    for (var s = 0; s < SEMESTER_NOW; s++) {
        activeCAs[s] = [];
        for (var i = 0; i < semesterToCA[s].length; i ++) {
            if (semesterToCA[s][i].activeCount > 0) {
                activeCAs[s].push(semesterToCA[s][i]);
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

function getCAAtCoord(x,y) {
  console.log (semesterToCA);
  for (var semester in semesterToCA) {
    for (var i = 0; i < semesterToCA[semester].length; i++) {
      var ca = semesterToCA[semester][i];
      console.log(ca);
      var bbox = ca.getBBox();
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

    //TODO: this is buggy right now
    //if (ca.clicked) {
    //  for (var i = 0; i < ca.children.length; i++) {
    //    ca.children[i].activeCount--;
    //  }
    //} else {
    for (var i = 0; i < ca.children.length; i++) {
      ca.children[i].activeCount++;
    }
    //}
    //ca.clicked = !ca.clicked;
  }

  drawFamilyTree();
}

canvas.addEventListener('mousedown', onMouseDown, false);

// cagraph represents the dag of mentor-mentee relationship
//
// andrewid - the andrewid of this ca
// children - a list of students ever taught by this ca
// pos - the position that the 
cclinch = new CA('cclinch', [], [0, 0], 9, 0);
ysolyani = new CA('ysolyani', [], [0, 0], 8, 1);
ysolyani.addChildren([cclinch]);
cwswanso = new CA('cwswanso', [], [0, 0], 10, 0);
mhansen1 = new CA('mhansen1', [], [0, 0], 9, 0);
mhansen1.addChildren([cwswanso]);
pmansfie = new CA('pmansfie', [], [0, 0], 9, 0);
shsia = new CA('shsia', [], [0, 0], 9, 0);
donaldh = new CA('donaldh', [], [0, 0], 9, 0);
msarett = new CA('msarett', [], [0, 0], 9, 0);
cpurta = new CA('cpurta', [], [0, 0], 9, 0);
xiaoboz = new CA('xiaoboz', [], [0, 0], 9, 0);
ptyle = new CA('ptyle', [], [0, 0], 9, 0);
msiangka = new CA('msiangka', [], [0, 0], 8, 0);
msiangka.addChildren([pmansfie,shsia,donaldh,msarett,cpurta,xiaoboz,cwswanso,ptyle]);
dcushman = new CA('dcushman', [], [0, 0], 13, 0);
tabraham = new CA('tabraham', [], [0, 0], 11, 1);
tabraham.addChildren([dcushman]);
afrank = new CA('afrank', [], [0, 0], 11, 0);
yili1 = new CA('yili1', [], [0, 0], 13, 0);
mchoquet = new CA('mchoquet', [], [0, 0], 9, 0);
mchoquet.addChildren([afrank,yili1]);
dmatlack = new CA('dmatlack', [], [0, 0], 8, 0);
mpherman = new CA('mpherman', [], [0, 0], 8, 0);
petling = new CA('petling', [], [0, 0], 9, 0);
akashr = new CA('akashr', [], [0, 0], 9, 0);
tborenst = new CA('tborenst', [], [0, 0], 9, 0);
achayes = new CA('achayes', [], [0, 0], 7, 0);
achayes.addChildren([dmatlack,mpherman,mchoquet,petling,akashr,tborenst]);
sguertin = new CA('sguertin', [], [0, 0], 14, 0);
jmfrye = new CA('jmfrye', [], [0, 0], 13, 0);
acrigler = new CA('acrigler', [], [0, 0], 14, 0);
jzink = new CA('jzink', [], [0, 0], 11, 0);
jzink.addChildren([sguertin,jmfrye,acrigler]);
gya = new CA('gya', [], [0, 0], 11, 0);
askumar = new CA('askumar', [], [0, 0], 8, 0);
askumar.addChildren([pmansfie,shsia,dcushman,donaldh,msarett,cpurta,gya,xiaoboz,ptyle]);
mvanpeur = new CA('mvanpeur', [], [0, 0], 9, 0);
dswen = new CA('dswen', [], [0, 0], 9, 0);
efaust = new CA('efaust', [], [0, 0], 8, 1);
efaust.addChildren([pmansfie,shsia,mvanpeur,donaldh,msarett,cpurta,xiaoboz,dswen,ptyle]);
aayusha = new CA('aayusha', [], [0, 0], 11, 0);
dbora = new CA('dbora', [], [0, 0], 13, 0);
dlbucci = new CA('dlbucci', [], [0, 0], 11, 0);
cwswanso = new CA('cwswanso', [], [0, 0], 10, 0);
cwswanso.addChildren([aayusha,dbora,dlbucci]);
petling = new CA('petling', [], [0, 0], 9, 0);
petling.addChildren([afrank]);
ltray = new CA('ltray', [], [0, 0], 8, 0);
ltray.addChildren([cclinch]);
malehorn = new CA('malehorn', [], [0, 0], 14, 0);
akulk = new CA('akulk', [], [0, 0], 14, 0);
varunm = new CA('varunm', [], [0, 0], 11, 0);
ebalkans = new CA('ebalkans', [], [0, 0], 9, 0);
sjoyner = new CA('sjoyner', [], [0, 0], 9, 0);
jacklinw = new CA('jacklinw', [], [0, 0], 11, 0);
ajkaufma = new CA('ajkaufma', [], [0, 0], 8, 0);
ajkaufma.addChildren([malehorn,akulk,varunm,ebalkans,sjoyner,jacklinw]);
advayak = new CA('advayak', [], [0, 0], 11, 0);
yuyangg = new CA('yuyangg', [], [0, 0], 11, 0);
tborenst = new CA('tborenst', [], [0, 0], 9, 0);
tborenst.addChildren([advayak,yuyangg]);
treiter = new CA('treiter', [], [0, 0], 13, 0);
mclute = new CA('mclute', [], [0, 0], 11, 1);
mclute.addChildren([treiter]);
shikunz = new CA('shikunz', [], [0, 0], 14, 0);
saagars = new CA('saagars', [], [0, 0], 9, 0);
mofarrel = new CA('mofarrel', [], [0, 0], 14, 0);
mschervi = new CA('mschervi', [], [0, 0], 8, 1);
mschervi.addChildren([aayusha,mhansen1,shikunz,saagars,mofarrel,dlbucci]);
cbrem = new CA('cbrem', [], [0, 0], 13, 0);
amsmith1 = new CA('amsmith1', [], [0, 0], 10, 0);
esmyers = new CA('esmyers', [], [0, 0], 11, 0);
mgazzola = new CA('mgazzola', [], [0, 0], 11, 0);
eob = new CA('eob', [], [0, 0], 11, 0);
akashr = new CA('akashr', [], [0, 0], 9, 0);
akashr.addChildren([cbrem,amsmith1,esmyers,mgazzola,eob]);
tstroemm = new CA('tstroemm', [], [0, 0], 8, 0);
tstroemm.addChildren([malehorn,akulk,dcushman,mvanpeur,varunm,dswen,jacklinw]);
noshlag = new CA('noshlag', [], [0, 0], 12, 0);
tcmoore = new CA('tcmoore', [], [0, 0], 13, 0);
yuyangg = new CA('yuyangg', [], [0, 0], 11, 0);
yuyangg.addChildren([noshlag,tcmoore]);
mpherman = new CA('mpherman', [], [0, 0], 8, 0);
mpherman.addChildren([mchoquet,akashr,tborenst]);
twomack = new CA('twomack', [], [0, 0], 8, 0);
twomack.addChildren([cclinch]);
mfiorill = new CA('mfiorill', [], [0, 0], 8, 1);
mfiorill.addChildren([ebalkans,sjoyner]);
cburchha = new CA('cburchha', [], [0, 0], 4, 0);
ibouchar = new CA('ibouchar', [], [0, 0], 3, 1);
ibouchar.addChildren([cburchha]);
lwzhang = new CA('lwzhang', [], [0, 0], 13, 0);
lwzhang.addChildren([sguertin,acrigler]);
yunhaoy = new CA('yunhaoy', [], [0, 0], 7, 0);
pauldavi = new CA('pauldavi', [], [0, 0], 7, 0);
cburchha = new CA('cburchha', [], [0, 0], 4, 0);
cburchha.addChildren([yunhaoy,ltray,pauldavi]);
wmacrae = new CA('wmacrae', [], [0, 0], 8, 1);
wmacrae.addChildren([advayak,ebalkans,sjoyner,yuyangg]);
mmatty = new CA('mmatty', [], [0, 0], 11, 0);
dbegos = new CA('dbegos', [], [0, 0], 13, 0);
mhranick = new CA('mhranick', [], [0, 0], 8, 0);
mhranick.addChildren([mmatty,mvanpeur,lwzhang,dbegos,dswen]);
tbenshac = new CA('tbenshac', [], [0, 0], 8, 1);
tbenshac.addChildren([amsmith1,dcushman,eob]);
snalla = new CA('snalla', [], [0, 0], 13, 0);
snalla.addChildren([mofarrel]);
asutanto = new CA('asutanto', [], [0, 0], 8, 0);
ytay = new CA('ytay', [], [0, 0], 4, 0);
ytay.addChildren([pmansfie,shsia,askumar,donaldh,msarett,asutanto,cpurta,xiaoboz,tstroemm,ptyle]);
nhildebr = new CA('nhildebr', [], [0, 0], 8, 1);
nhildebr.addChildren([mhansen1,shikunz,saagars]);
lstreja = new CA('lstreja', [], [0, 0], 4, 0);
krivers = new CA('krivers', [], [0, 0], 3, 0);
krivers.addChildren([dmatlack,mvanpeur,lstreja,ytay,dswen,achayes]);
malleyne = new CA('malleyne', [], [0, 0], 8, 1);
malleyne.addChildren([ebalkans,sjoyner]);
dbose = new CA('dbose', [], [0, 0], 8, 1);
dbose.addChildren([cclinch]);
mdickoff = new CA('mdickoff', [], [0, 0], 8, 1);
mdickoff.addChildren([mchoquet,akashr,tborenst]);
kbaysal = new CA('kbaysal', [], [0, 0], 9, 1);
kbaysal.addChildren([mmatty,lwzhang,dbegos]);
amalyshe = new CA('amalyshe', [], [0, 0], 8, 0);
amalyshe.addChildren([pmansfie,shsia,donaldh,msarett,cpurta,xiaoboz,ptyle]);
sewillia = new CA('sewillia', [], [0, 0], 8, 1);
sewillia.addChildren([cclinch]);
svargo = new CA('svargo', [], [0, 0], 8, 1);
svargo.addChildren([mhansen1,shikunz,saagars]);
gbartlow = new CA('gbartlow', [], [0, 0], 0, 1);
gbartlow.addChildren([krivers]);
dmatlack = new CA('dmatlack', [], [0, 0], 8, 0);
dmatlack.addChildren([mchoquet,akashr,tborenst]);
akbhanda = new CA('akbhanda', [], [0, 0], 8, 0);
akbhanda.addChildren([ebalkans,sjoyner]);
amsmith1 = new CA('amsmith1', [], [0, 0], 10, 0);
amsmith1.addChildren([cbrem,esmyers,mgazzola]);
haozheg = new CA('haozheg', [], [0, 0], 13, 0);
kmao = new CA('kmao', [], [0, 0], 13, 0);
asutanto = new CA('asutanto', [], [0, 0], 8, 0);
asutanto.addChildren([haozheg,mvanpeur,kmao,gya,dswen]);
igillis = new CA('igillis', [], [0, 0], 8, 1);
igillis.addChildren([mhansen1,shikunz,saagars]);
rokhinip = new CA('rokhinip', [], [0, 0], 11, 0);
anwu = new CA('anwu', [], [0, 0], 11, 0);
okahn = new CA('okahn', [], [0, 0], 11, 0);
xiaoboz = new CA('xiaoboz', [], [0, 0], 9, 0);
xiaoboz.addChildren([rokhinip,anwu,snalla,jzink,okahn]);
saagars = new CA('saagars', [], [0, 0], 9, 0);
saagars.addChildren([rokhinip,dcushman,anwu,snalla,jzink,okahn]);
yunhaoy = new CA('yunhaoy', [], [0, 0], 7, 0);
yunhaoy.addChildren([mpherman,petling]);
afrank = new CA('afrank', [], [0, 0], 11, 0);
afrank.addChildren([mofarrel]);
vjeet = new CA('vjeet', [], [0, 0], 9, 0);
tmfox = new CA('tmfox', [], [0, 0], 7, 0);
thopper = new CA('thopper', [], [0, 0], 4, 1);
thopper.addChildren([msiangka,askumar,vjeet,asutanto,twomack,mhranick,tstroemm,amalyshe,ajkaufma,akbhanda,tmfox]);
dswen = new CA('dswen', [], [0, 0], 9, 0);
dswen.addChildren([advayak,yuyangg]);
pauldavi = new CA('pauldavi', [], [0, 0], 7, 0);
pauldavi.addChildren([msiangka,mchoquet,twomack,akashr,ajkaufma,tborenst]);
jmfrye = new CA('jmfrye', [], [0, 0], 13, 0);
jmfrye.addChildren([sguertin,acrigler]);


console.log("WHAT THE FUCK");
drawFamilyTree();

