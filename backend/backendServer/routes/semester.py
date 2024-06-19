from flask import request

from backendServer import app

from dbPackage import interface_v2 as interface

from datetime import datetime

#####################################
# Helper Functions
#####################################

def getPreviousHalf(yearHalf):
    yearList = yearHalf.split()

    year = int(yearList[0])
    half = int(yearList[2])
    
    if half == 1:
        previousYear = year - 1
        previousHalf = 2
    else:
        previousYear = year
        previousHalf = 1
    
    return f"{previousYear} Semester {previousHalf}"

def getNextHalf(yearHalf):
    yearList = yearHalf.split()

    year = int(yearList[0])
    half = int(yearList[2])
    
    if half == 1:
        nextYear = year
        nextHalf = 2
    else:
        nextYear = year + 1
        nextHalf = 1
    
    return f"{nextYear} Semester {nextHalf}"

#####################################
# Semester Routes
#####################################

# --Working-- --Incomplete--
@app.route('/semesters', methods=['get'])
def getAllSemesters():

    semesters, status = interface.getAllSemesters()

    if not status:
        return semesters, 500
    
    semesterList = [sem.to_dict() for sem in semesters]

    return semesterList, 200

# --Working-- --Incomplete--
@app.route('/semesters', methods=['post'])
def createNewSemester():
    data = request.json
    
    msg, stat = interface.newSemester(data.get('semesterName'))

    if stat:
        stat = 200
        msg = msg.to_dict()
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters', methods=['put'])
def updateSemester():
    data = request.json

    semesterID = data.get('semesterID')
    newName = data.get('newName')

    msg, stat = interface.updateSemester(semesterID, newName, None, None, None)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat


# --Working-- --Incomplete--
@app.route('/semesters/<int:semID>', methods=['delete'])
def deleteSemester(semID):

    msg, stat = interface.deleteSemester(semID)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/<int:semID>', methods=['get'])
def getSemester(semID):

    msg, stat = interface.getSemesterById(semID)

    if stat:
        stat = 200
        msg = msg.to_dict()
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/populate', methods=['put'])
def populateSemester():

    currentSem, stat = interface.getSelectedSemester()
    if not stat:
        return currentSem, 500
    
    prevSameName = getPreviousHalf(currentSem.name)

    prevSem, stat = interface.getSemesterByName(prevSameName)

    if not stat:
        return f"ERROR Previous Semester exists with Name: {prevSameName}", 400

    previousSemID = prevSem.semesterId
    currentSemID = currentSem.semesterId

    msg, stat = interface.populateSemester(previousSemID, currentSemID)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/deadline/submission', methods=['put'])
def setSubDeadline():

    data = request.json
    semID = data.get('semesterID')
    dateTimeString = data.get('dateTimeString')

    deadline = datetime.fromisoformat(dateTimeString)

    msg, stat = interface.updateSemester(semID, None, deadline, None, None)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/deadline/preferences', methods=['put'])
def setPrefsDeadline():

    data = request.json
    semID = data.get('semesterID')
    dateTimeString = data.get('dateTimeString')

    deadline = datetime.fromisoformat(dateTimeString)

    msg, stat = interface.updateSemester(semID, None, None, deadline, None)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/select', methods=['put'])
def selectSemester():

    data = request.json
    semID = data.get('semesterID')

    msg, stat = interface.updateSemester(semID, None, None, None, True)

    if stat:
        stat = 200
    else:
        stat = 400

    return msg, stat

# --Working-- --Incomplete--
@app.route('/semesters/selected', methods=['get'])
def selectedSemester():

    msg, stat = interface.getSelectedSemester()

    if stat:
        msg = msg.to_dict()
        stat = 200
    else:
        stat = 500
       # msg = "Internal Server Error"

    return msg, stat