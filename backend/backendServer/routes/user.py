from flask import request

from backendServer import app

from dbPackage.modelsV2 import Client, Group, Admin, User
from dbPackage import interface_v2 as interface

#####################################
# User List Routes
#####################################

# --Working-- --Incomplete--
@app.route('/users', methods=['GET'])
def getAllUsers():
    users, status = interface.allUsers()
    uList = [user.to_dict() for user in users]
    return uList, 200

# --Working-- --Incomplete--
@app.route('/clients', methods=['GET'])
def getAllClients():
    clients, status = interface.allClients()
    uList = [user.to_dict() for user in clients]
    return uList, 200

# --Working-- --Incomplete--
@app.route('/admins', methods=['GET'])
def getAllAdmins():
    admins, status = interface.allAdmins()
    uList = [user.to_dict() for user in admins]
    return uList, 200

# --Working-- --Incomplete--
@app.route('/students', methods=['GET'])
def getAllGroups():
    groups, status = interface.allGroups()

    currentSem, stat = interface.getSelectedSemester()
    groupsThisSem = []
    for group in groups:
        if group.semester == currentSem:
            groupsThisSem.append(group)

    uList = [group.to_dict() for group in groupsThisSem]
    return uList, 200

#####################################
# User Create Routes
#####################################

# --working-- --Incomplete--
@app.route('/students', methods=['POST'])
def createGroup():
    data = request.json
    #print(request.data)

    username = data.get('username')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    teamName = data.get('teamName')

    semester, status = interface.getSelectedSemester()

    if not status:
        return "ERROR: Semester not found", 404

    if teamName is None:
        teamName = "default"

    message, status = interface.newGroup(username=username, password=password, firstName=firstName, lastName=lastName, email=email, teamname=teamName, semester=semester)

    if isinstance(message, Group):
        message = message.to_dict()

    if status:
        status = 200

    return message, status

#--working-- --Incomplete--
@app.route('/admins', methods=['POST'])
def createAdmin():
    data = request.json
    #print(request.data)

    username = data.get('username')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    availableHours = data.get('avaliableHours')

    semester, status = interface.getSelectedSemester()

    if not status:
        return "ERROR: Semester not found", 404

    #default available hours to 10
    if not isinstance(availableHours, int):
        availableHours = 10

    message, status = interface.newAdmin(username, password, firstName, lastName, email, semester, availableHours)
    
    if isinstance(message, Admin):
        message = message.to_dict()

    if status:
        status = 200
    else:
        status = 400

    return message, status

# --working-- --Incomplete--
@app.route('/clients', methods=['POST'])
def createClient():
    data = request.json
    #print(request.data)

    username = data.get('username')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    semID = data.get('semesterID')

    semester, status = interface.getSemesterById(semID)

    if not status:
        return "ERROR: Semester not found", 404

    message, status = interface.newClient(username=username, password=password, firstName=firstName, lastName=lastName, email=email, semester=semester)

    if isinstance(message, Client):
        message = message.to_dict()

    if status:
        status = 200

    return message, status

#####################################
# Delete User by ID Routes
#####################################

# --working-- --Incomplete--
@app.route('/admins/<int:adminID>', methods=['DELETE'])
def delAdmin(adminID):
    message, status = interface.deleteAdmin(adminID)
    if status:
        return message, 200
    else:
        return message, 404

#--working-- --Incomplete--
@app.route('/clients/<int:clientID>', methods=['DELETE'])
def delClient(clientID):
    message, status = interface.deleteClient(clientID)
    if status:
        return message, 200
    else:
        return message, 404

# --working-- --Incomplete--
@app.route('/students/<int:groupID>', methods=['DELETE'])
def delGroup(groupID):
    message, status = interface.deleteGroup(groupID)
    if status:
        return message, 200
    else:
        return message, 404

#####################################
# get User by ID Route
#####################################

#--Working-- --Incomplete--
@app.route('/users/<int:userID>', methods=['get'])
def getUserByID(userID):
    user, status = interface.getUserById(userID)
    if status:
        return user.to_dict(), 200
    else:
        return user, 404
    
#####################################
# Assign group to Project
#####################################

#--Working-- --Incomplete--
@app.route('/assignProject', methods=['post'])
def assignProject():
    data = request.json
    groupId = data.get('groupId')
    projectId = data.get('projectId')

    msg, stat = interface.assignProject(projectId, groupId)

    if stat:
        stat = 200
    else:
        stat = 400
    return msg, stat

#####################################
# get user by username
#####################################

#--Working-- --Incomplete--
@app.route('/users/<string:username>', methods=['get'])
def getUserByUsername(username):

    msg, stat = interface.getUserbyUsername(username)

    if stat:
        stat = 200
        msg = msg.to_dict()
    else:
        stat = 400
    return msg, stat

#####################################
# update user by id
#####################################

#--Working-- --Untested--
@app.route('/updateUser', methods=['post'])
def updateUser():
    data = request.json

    userId = data.get('id')
    field = data.get('field')
    updatedData = data.get('newInput')

    msg, stat = interface.updateUser(userId, field, updatedData)

    if stat:
        stat = 200
    else:
        stat = 400
    return msg, stat

# --Working-- --Incomplete--
@app.route('/user/preferences', methods=['put'])
def updateProjectPrefs():

    data = request.json

    groupID = data.get('groupID')
    prefs = data.get('preferenceIDs')

    if not isinstance(prefs, list):
        return "ERROR: Invalid Request, preferenceIDs field invalid, wrong type", 400
    if len(prefs) != 5:
        return "ERROR: Invalid Request, preferenceIDs list length incorrect must be 5", 400

    msg, stat = interface.addPreferences(id=groupID, projects=prefs)

    if not stat:
        stat = 400
    else:
        stat = 200
    
    return msg, stat

@app.route('/users/selected', methods=['get'])
def getSelectedGroups():

    msg, stat = interface.getGroupsWithSelectedProject()

    if stat:
        stat = 200
        msg = [thing.to_dict() for thing in msg]
    else:
        stat = 500

    return msg, stat