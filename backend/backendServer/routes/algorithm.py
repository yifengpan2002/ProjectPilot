from flask import request

from backendServer import app

from dbPackage import interface_v2 as interface
from dbPackage.modelsV2 import Group, Project, Client

from algorithm.algorithm import completeAlgorithm
import time
#####################################
# Algorithm Routes
#####################################

def getProjectIDs(input):
    """
    Converts a list of Projects into a list of project IDs
    """
    output = []
    for proj in input:
        output.append(proj.projectId)
    return output


def getStudentsWithPrefs(input):
    """
    Takes a List of Group objects
    returns a list of all Groups who have submitted a set of 5 preferences
    """
    output = []
    for student in input:
        if len(student.projectPreferences) == 5:
            output.append(student)
    return output

# --Working-- --Incomplete--
@app.route('/matchAllTeams', methods=['post'])
def matchAll():

    #extract request data
    data = request.json
    projectIDS = data.get('projectList')
    teamIDS = data.get('teamList')
    adminHours = data.get('availableTime')

    students = []

    if len(teamIDS) < 5:
        return "ERROR: " 

    #convert team IDs to actual student Objects
    for teamID in teamIDS:
        msg, state = interface.getUserById(teamID)
        if state and isinstance(msg, Group):
            students.append(msg)
        else:
            #Return an error for an invalid student
            return "ERROR: Invalid Student in students List", 400

    projects = []

    print(projectIDS)

    #convert project IDs to actual project Objects
    for projectID in projectIDS:
        msg, state = interface.getProjectById(projectID)
        if state and isinstance(msg, Project):
            projects.append(msg)
        else:
            #Return an error for an invalid project
            return "ERROR: Invalid project in projects List", 400


    preferenceDict = {}
    projs = []

    #building project preferences dict for algorithm and filling out projects list to build team count tuple array.
    for student in students:

        #add project to projects list if its not there already.
        for project in student.projectPreferences:
            if project not in projs:
                if project in projects:
                    projs.append(project)
                else:
                    return f"ERROR project {project.title} in student preferences but not selected for consideration", 400

        #get list of project Ids from list of projects
        projectIDs = getProjectIDs(student.projectPreferences)

        #add list of projectIds to the preferences dict with the group Id to the keys
        preferenceDict[student.groupId] = projectIDs

    projectTeamCount = []

    #generating a list of tuples of projectId and maxTeamCount 
    for proj in projs:
        projectTeamCount.append((proj.projectId, proj.numberOfTeams))

    #setting submission order
    #currently just done by order of input list will be fixed once db function to pull this information is made available.
    submissionOrder = teamIDS
    if app.debug == True:
        #Tidy Printout of whats going into the algorithm
        print("==="*5,"Algorithm Inputs","==="*5)
        print("submissionOrder = ", submissionOrder, sep="", end="\n\n")
        print("teamInfo = ", preferenceDict, sep="", end="\n\n")
        print("projectTups = ", projectTeamCount, sep="", end="\n\n")
        print("maxHours = ", adminHours, sep="")

    #running the algorithm
    #matchedState, cost = mainAlg(adminHours, preferenceDict, projectTeamCount, submissionOrder)
    start_time = time.time()
    newOutputList, trueCost, teamsSatisfactionsDict = completeAlgorithm(preferenceDict, projectTeamCount, submissionOrder, adminHours)
    end_time = time.time()
    execution_time = end_time - start_time
    #print("Execution time:", execution_time, "seconds")

    #print("COST: ", cost)
    #print("Pairings: ", matchedState)

    processedOut = []
    newSatDict = {}

    for pair in newOutputList:
        group, stat = interface.getUserById(pair[0])

        groupName = group.teamName
        newSatDict[group.teamName] = teamsSatisfactionsDict[pair[0]]

        proj, stat = interface.getProjectById(pair[1])

        projName = proj.title

        processedOut.append((groupName, projName))


    

    returnDict = {
        'groupProjectPairs': processedOut,
        'trueCost': trueCost,
        'teamSatisfactionsDict': newSatDict
    }
    
    if app.debug == True:
        print(newOutputList)
    for pair in newOutputList:
        groupID, projectID = pair
        
        msg, stat = interface.assignProject(projectID, groupID)
        if not stat:
            return msg, 500

    return returnDict, 200