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

seen = set()
jsfile = open("CAFamilyData.js", "w")
def createCA(seen, CAtoCAInfo, sourceDest, jsfile, thisCA):
  semestersCAed = CAtoCAInfo[thisCA]["CAed"]
  semestersCAed = [semester for semester in semestersCAed.keys() if semestersCAed[semester]]

  active = 1
  for possibleMentor, mentees in sourceDest.items():
    if thisCA in mentees:
      active = 0
      break

  args = (thisCA, [], [0,0], min(semestersCAed), active)
  jsfile.write(thisCA + " = new CA" + repr(args) + ";\n")
  seen.add(thisCA)

for (mentor, mentees) in sourceDest.items():
  for mentee in mentees:
    if mentee not in seen:
      #semestersCAed = [semesterToNumber[semester] for semester in CAtoCAInfo[mentee]["CAed"] if semester]
      #semestersCAed = CAtoCAInfo[mentee]["CAed"]
      #semestersCAed = [semester for semester in semestersCAed.keys() if semestersCAed[semester]]
      #args = (mentee, [], [0,0], min(semestersCAed), 0)
      #jsfile.write(mentee + " = new CA" + repr(args) + "\n")
      #seen.add(mentee)
      createCA(seen, CAtoCAInfo, sourceDest, jsfile, mentee)

  #semestersCAed = CAtoCAInfo[mentor]["CAed"]
  #semestersCAed = [semester for semester in semestersCAed.keys() if semestersCAed[semester]]
  ## semestersCAed = [semesterToNumber[semester] for semester in CAtoCAInfo[mentor]["CAed"] if semester]
  #if min(semestersCAed) == 0:
  #  args = (mentor, [], [0,0], 0, 1)
  #else:
  #  args = (mentor, [], [0,0], min(semestersCAed), 0)
  #jsfile.write(mentor + " = new CA" + repr(args) + ";\n")
  createCA(seen, CAtoCAInfo, sourceDest, jsfile, mentor)
  jsfile.write(mentor + ".addChildren([" + ",".join(mentees) + "]);\n")
  seen.add(mentor)

jsfile.close()
f.close()
