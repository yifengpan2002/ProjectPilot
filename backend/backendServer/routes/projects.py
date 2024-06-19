from flask import request

from backendServer import app

from dbPackage.modelsV2 import Project
from dbPackage import interface_v2 as interface

import json

#####################################
# Project Routes
#####################################

# --Working-- --Incomplete--
@app.route('/projects', methods=['get'])
def getAllProjects():
    projecs, status = interface.getAllProjects()

    currentSem, stat = interface.getSelectedSemester()
    projects = []
    for proj in projecs:
        if proj.semester == currentSem:
            projects.append(proj)


    pList = [proj.to_dict() for proj in projects]
    return pList, 200



# --Working-- --Incomplete--
@app.route('/projects/<int:projID>', methods=['get'])
def getProjectByID(projID):
    project, status = interface.getProjectById(projID)
    if status:
        project = project.to_dict()
        status = 200
    else:
        status = 404
    return project, status

# --Working-- --Incomplete--
@app.route('/projects/<int:projID>', methods=['DELETE'])
def delProjectByID(projID):
    project, status = interface.deleteProject(projID)
    if status:
        return (project, 200)
    else:
        return (project, 404)

# --Working-- --Incomplete--
@app.route('/projects', methods=['post'])
def postProject():
    data = request.json

    clientID = data.get('clientID')
    title = data.get('title')
    description = data.get('description')
    mvp = data.get('MVP')
    preferredSkills = data.get('preferredSkills')
    requiredEquipment = data.get('requiredEquipment')
    noOfTeams = data.get('noOfTeams')
    availableReources = data.get('availableResources')
    futureConsideration = data.get('futureConsideration')
    additionalInformation = data.get('additionalInformation')
    
    client, status = interface.getUserById(clientID)

    if not status:
        return ("ERROR: INVALID CLIENT"), 400
    
    
    semester, status = interface.getSelectedSemester()

    if not status:
        return ("ERROR: INVALID SEMESTER"), 400
    
    addInfoStr = None

    if additionalInformation is not None:
        addInfoStr = json.dumps(additionalInformation)

    message, status = interface.newProject(
        title = title,
        description = description,
        MVP = mvp,
        preferredSkills = preferredSkills,
        requiredEquipment = requiredEquipment,
        numberOfTeams = noOfTeams,
        availableResources = availableReources,
        futureConsideration = futureConsideration,
        client = client,
        semester=semester,
        additionalInformation=addInfoStr
        )
    


    if status:
        status = 201
        message = "INFO:Project Succesfully Created" 
    else:
        status = 400

    return message, status

# --Working-- --Incomplete--
@app.route('/projects', methods=['put'])
def updateProject():
    data = request.json

    projectID = data.get('projectID')
    title = data.get('title')
    description = data.get('description')
    mvp = data.get('MVP')
    preferredSkills = data.get('preferredSkills')
    requiredEquipment = data.get('requiredEquipment')
    noOfTeams = data.get('noOfTeams')
    availableReources = data.get('availableResources')
    futureConsideration = data.get('futureConsideration')
    semesterID = data.get('semesterID')
    additionalInformation = data.get('additionalInformation')
    
    proj, status = interface.getProjectById(projectID)

    if not status:
        return ("ERROR: INVALID PROJECT"), 400
    
    semester = None
    status = 1

    if semesterID is not None:
        semester, status = interface.getSemesterById(semesterID)

    if not status:
        return ("ERROR: INVALID SEMESTER"), 400
    
    addInfo = None

    if additionalInformation is not None:
        addInfo = json.dumps(additionalInformation)
    

    message, status = interface.updateProject(
        id = projectID,
        newTitle = title,
        newDescription= description,
        newMVP = mvp,
        newPreferredSkills = preferredSkills,
        newRequiredEquipment = requiredEquipment,
        newNumberOfTeams = noOfTeams,
        newAvailableResources = availableReources,
        newFutureConsideration = futureConsideration,
        newSemester = semester,
        newAdditionalInformation=addInfo
        )


    if status:
        status = 200
        message = "INFO:Project Succesfully Updated" 
    else:
        status = 400

    return message, status

# --Working-- --Incomplete--
@app.route('/projects/published', methods=['get'])
def getPublishedProjects():
    projecs, stat = interface.getAllProjects()

    currentSem, stat = interface.getSelectedSemester()
    projects = []
    for proj in projecs:
        if proj.semester == currentSem:
            projects.append(proj)

    if not stat:
        return projects, 400
    
    publishedProjectsOBJ = []

    for proj in projects:
        if proj.published:
            publishedProjectsOBJ.append(proj)
            dispNum = len(publishedProjectsOBJ)
            interface.updateProject(id=proj.projectId, newDisplayNumber=dispNum)
    
    return [pj.to_dict() for pj in publishedProjectsOBJ], 200

# --Working-- --Incomplete--
@app.route('/projects/published', methods=['put'])
def publishProject():

    data = request.json

    id = data.get('id')
    published = data.get('published')

    if not isinstance(published, bool):
        return "ERROR: Invalid Request, published field invalid", 400

    msg, stat = interface.updateProject(id=id, newPublished=published)

    if not stat:
        stat = 400
    else:
        stat = 200
    
    return msg, stat

# --Working-- --Incomplete--
@app.route('/projects/approved', methods=['get'])
def getApprovedProjects():    
    projecs, stat = interface.getAllProjects()

    currentSem, stat = interface.getSelectedSemester()
    projects = []
    for proj in projecs:
        if proj.semester == currentSem:
            projects.append(proj)

    if not stat:
        return projects, 400
    
    approvedProjects = []

    for proj in projects:
        if proj.status == "approved":
            approvedProjects.append(proj.to_dict())
    
    return approvedProjects, 200

# --Working-- --Incomplete--
@app.route('/projects/rejected', methods=['get'])
def getRejectedProjects():
    projecs, stat = interface.getAllProjects()

    currentSem, stat = interface.getSelectedSemester()
    projects = []
    for proj in projecs:
        if proj.semester == currentSem:
            projects.append(proj)

    if not stat:
        return projects, 400
    
    rejectedProjects = []

    for proj in projects:
        if proj.status == "rejected":
            rejectedProjects.append(proj.to_dict())
    
    return rejectedProjects, 200

# --Working-- --Incomplete--
@app.route('/projects/pending', methods=['get'])
def getPendingProjects():
    projecs, stat = interface.getAllProjects()

    currentSem, stat = interface.getSelectedSemester()
    projects = []
    for proj in projecs:
        if proj.semester == currentSem:
            projects.append(proj)

    if not stat:
        return projects, 400
    
    pendingProjects = []

    for proj in projects:
        if proj.status == "pending":
            pendingProjects.append(proj.to_dict())
    
    return pendingProjects, 200

# --Working-- --Incomplete--
@app.route('/projects/status', methods=['put'])
def updateProjectStatus():

    data = request.json

    id = data.get('id')
    status = data.get('status')

    if status not in ["approved", "pending", "rejected"]:
        return "ERROR: Invalid Request, status field invalid", 400

    msg, stat = interface.updateProject(id=id, newStatus=status)

    if not stat:
        stat = 400
    else:
        stat = 200
    
    return msg, stat