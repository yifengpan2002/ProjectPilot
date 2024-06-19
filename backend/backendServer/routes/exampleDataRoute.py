from backendServer import app
from dbPackage.modelsV2 import Client, Group, Project, User
from dbPackage import interface_v2 as interface


    
# --Working-- --Incomplete--
@app.route('/loadExamples', methods=['GET'])
def loadExampleData():
    currentSem, stat = interface.getSelectedSemester()
    import backendServer.exampleData as exampleData
    for i in range(exampleData.dataLength):
        client = exampleData.clients[i]
        project = exampleData.projects[i]
        group = exampleData.groups[i]

        username = client['username']
        password = client['password']
        firstName = client['firstName']
        lastName = client['lastName']
        email = client['email']

        newClient, stat = interface.newClient(username=username, password=password, firstName=firstName, lastName=lastName, email=email, semester=currentSem)
        if not stat:
            print("Client: ", newClient)
        # print(msg + f" {i}")
        title = project['title']
        description = project['description']
        mvp = project['MVP']
        preferredSkills = project['preferedSkills']
        requiredEquipment = project['requiredEquipment']
        noOfTeams = project['numberOfTeams']
        availableReources = project['availableResouces']
        futureConsideration = project['futureConsideration']

        msg, stat = interface.newProject(
        title = title,
        description = description,
        MVP = mvp,
        preferredSkills = preferredSkills,
        requiredEquipment = requiredEquipment,
        numberOfTeams = noOfTeams,
        availableResources = availableReources,
        futureConsideration = futureConsideration,
        client = newClient,
        semester=currentSem,
        additionalInformation=None
        )
        if not stat:
            print("Project: ", msg)
        # if i == 0:
        #     print(msg)
        #     break
        # # print(msg + f" {i}")

        username = group['username']
        password = group['password']
        firstName = group['firstName']
        lastName = group['lastName']
        email = group['email']
        teamName = group['teamname']

        msg, status = interface.newGroup(username=username, password=password, firstName=firstName, lastName=lastName, email=email, teamname = teamName, semester=currentSem)
        
        if not status:
            print("Group: ", msg)
        # print(msg + f" {i}")

    return ("SUCCESS", 200)

# --Working-- --Incomplete--
@app.route('/loadExamplePrefs', methods=['GET'])
def loadExamplePrefs():
    import backendServer.exampleData as exampleData
    state = 1
    for group in exampleData.groups:
        prefs = group['prefs']
        username = group['username']
        groupObj, stat = interface.getUserbyUsername(username)
        groupDict = groupObj.to_dict()
        id = groupDict['groupId']

        
        msg, stat = interface.addPreferences(id, prefs)
        if stat != 1:
            state = 0
    if not state:
        return ("ERROR: Failed to add 1 or more preferences", 500)

    return ("SUCCESS", 200)


