f = open("CAFamilyData.csv")

MAGIC_NUMBER = 4
lines = f.readlines()
lines = [line.rstrip().split(",") for line in lines]
header = lines[0]
lines = lines[1:]
semesterToNumber = { }

for i in xrange(MAGIC_NUMBER, len(header)):
  semesterToNumber[header[i][:3]] = i - MAGIC_NUMBER

print semesterToNumber

print lines

CAtoCAInfo = {}

for line in lines:
  semesterInfo = {}
  
  for semester in xrange(MAGIC_NUMBER,len(line)):
    # maps semester to section TAed
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
      if info1["CAed"][index] == info2["section"]:
        if sourceDest.get(ca1, None) == None:
          sourceDest[ca1] = [ca2]
        else:
          sourceDest[ca1] += [ca2]
 
print sourceDest

f.close()
