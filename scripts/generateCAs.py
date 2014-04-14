import argparse

# argparse-ing...
parser = argparse.ArgumentParser(description="Generate JSON CA objects from .csv file")
parser.add_argument("-m", metavar="<mode>", default="", type=str, nargs=1,
                    help="Target JSON object used for JIT");
result = parser.parse_args()
result = vars(result)

mode = result.get("m","")[0]
f = open("CAFamilyData.csv")

MAGIC_NUMBER = 4
lines = f.readlines()
lines = [line.rstrip().split(",") for line in lines]
header = lines[0]
lines = lines[1:]
semesterToNumber = { }

for i in xrange(MAGIC_NUMBER, len(header)):
  semesterToNumber[header[i][:3]] = i - MAGIC_NUMBER

CAtoCAInfo = {}

for line in lines:
  semesterInfo = {}
  
  for semester in xrange(MAGIC_NUMBER,len(line)):
    # maps semester to section TAed
    if len(line[semester]) > 1:
      semesterInfo[semester-MAGIC_NUMBER] = list(line[semester])
    else:
      semesterInfo[semester-MAGIC_NUMBER] = line[semester]
  
  CAtoCAInfo[line[1]] = {
    "semester" : line[2], # semester CA took 100/110/112
    "section" : line[3], # section CA was in
    "CAed" : semesterInfo
  }

sourceDest = {}
for (ca1, info1) in CAtoCAInfo.items():
  for (ca2, info2) in CAtoCAInfo.items():
    semester = info2["semester"]
    if semester: 
      index = semesterToNumber[semester]
      if info1["CAed"][index] == info2["section"] or \
         info2["section"] in info1["CAed"][index]:
        if sourceDest.get(ca1, None) == None:
          sourceDest[ca1] = [ca2]
        else:
          sourceDest[ca1] += [ca2]
 
print sourceDest

def createCA(seen, CAtoCAInfo, sourceDest, jsfile, thisCA):
  if thisCA in seen: return
  
  for mentee in sourceDest.get(thisCA, []):
    createCA(seen, CAtoCAInfo, sourceDest, jsfile, mentee)

  semestersCAed = CAtoCAInfo[thisCA]["CAed"]
  semestersCAed = [semester for semester in semestersCAed.keys() if semestersCAed[semester]]

  # TODO: bad runtime, I'm saying F*** IT for now.
  active = 1
  for possibleMentor, mentees in sourceDest.items():
    if thisCA in mentees:
      active = 0
      break

  args = (thisCA, [], [0,0], min(semestersCAed), active)
  jsfile.write(thisCA + " = new CA" + repr(args) + ";\n")
  jsfile.write(thisCA + ".addChildren([" + ",".join(sourceDest.get(thisCA, [])) + "]);\n")
  seen.add(thisCA)

def createCADracula(seen, CAtoCAInfo, sourceDest, jsfile, thisCA):
  if thisCA in seen: return

  for mentee in sourceDest.get(thisCA, []):
    createCADracula(seen, CAtoCAInfo, sourceDest, jsfile, mentee)

  jsfile.write("g.addNode(" + repr(thisCA) + ");\n")
  for mentee in sourceDest.get(thisCA, []):
    jsfile.write("g.addEdge(" + repr(thisCA) + ", " + repr(mentee) + ");\n")
  seen.add(thisCA)

def createCAD3(seen, CAtoCAInfo, sourceDest, jsfile, thisCA, CAToNumMap, num):
  if thisCA in seen: return num
  
  for mentee in sourceDest.get(thisCA, []):
    num = createCAD3(seen, CAtoCAInfo, sourceDest, jsfile, mentee, CAToNumMap, num)
        
  semester = findMinSemesterCAed(CAtoCAInfo, sourceDest, thisCA)
  CAToNumMap[thisCA] = num
  jsfile.write("\t\t{\"names\":%s,group:%d},\n" % (repr(thisCA), semester))
  seen.add(thisCA)
  return num + 1
  
def findMinSemesterCAed(CAtoCAInto, sourceDest, thisCA):
  semestersCAed = CAtoCAInfo[thisCA]["CAed"]
  semestersCAed = [semester for semester in semestersCAed.keys() if semestersCAed[semester]]
  return min(semestersCAed)

seen = set()
if mode == "jit":
  jsfile = open("CAFamilyData.js", "w")
  pass
elif mode == "dracula":
  jsfile = open("CAFamilyData.js", "w")
  for CA in sourceDest:
    createCADracula(seen, CAtoCAInfo, sourceDest, jsfile, CA)
elif mode == "d3":
  jsfile = open("cas.json", "w")
  jsfile.write("{\n")
  jsfile.write("\"nodes\" : [\n")
  num = 1
  CAToNumMap = {}
  for mentor, mentees in sourceDest.items():
    num = createCAD3(seen, CAtoCAInfo, sourceDest, jsfile, mentor, CAToNumMap, num)
    for mentee in mentees:
      num = createCAD3(seen, CAtoCAInfo, sourceDest, jsfile, mentee, CAToNumMap, num)
  jsfile.write("],\n")
  jsfile.write("\"links\" : [\n")
  for mentor, mentees in sourceDest.items():
    mentorSemester = findMinSemesterCAed(CAtoCAInfo, sourceDest, mentor)
    for mentee in mentees:
      menteeSemester = findMinSemesterCAed(CAtoCAInfo, sourceDest, mentee)
      jsfile.write("{\t\t\"source\":%d,\"target\":%d,\"value\":%d\n" % \
                   (CAToNumMap[mentor], CAToNumMap[mentee], menteeSemester - mentorSemester))

else:
  jsfile = open("CAFamilyData.js", "w")
  for CA in sourceDest:
    createCA(seen, CAtoCAInfo, sourceDest, jsfile, CA)

jsfile.close()
f.close()
