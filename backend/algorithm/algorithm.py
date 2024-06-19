import copy, random, math
random.seed(math.sqrt(2))


#The following describes the "Project" object
class Project:
    def __init__(self, projectTup):
        self.projectId = projectTup[0]
        self.maxThreshold = projectTup[1]
    def getId(self):
        return self.projectId
    def getThreshold(self):
        return self.maxThreshold
    def __str__(self):
        return "project ID: " + str(self.projectId) + " MaxTeams: " + str(self.maxThreshold)
    def __repr__(self):
        return self.__str__()
    def __lt__(self, other):
        return self.projectId < other.projectId
    def __gt__(self, other):
        return self.projectId > other.projectId

#The following describes the "Team" object
class Team:
    def __init__(self, teamInfo):
        self.teamId = teamInfo[0]
        self.teamPrefs = teamInfo[1]
    def getPrefs(self):
        return self.teamPrefs
    def __str__(self):
        return "Team ID: " + str(self.teamId) + " Preferences: " + str(self.teamPrefs)
    def __repr__(self):
        return self.__str__()
    def __lt__(self, other):
        return self.teamId < other.teamId
    def __gt__(self, other):
        return self.teamId > other.teamId

#The following code describes the "MatchingState" object.
class MatchingState:
    def __init__(self, projects, teams, submissionsCosts, preMade=None): #Generates an Initial state
        if preMade==None: #ie. if there is no predefined state
            self.projects = projects
            self.teams = teams
            self.submissionsCosts = submissionsCosts
            self.isFinalState = False
            projectsMatchingInfo = [project.getThreshold() for project in projects] #Initially, all projects are empty
            self.groupPairings = [None]*len(teams) #This will be filled with indexes of the teams
            projectIndex = 0
            projectCount = len(projects)
            groupId = 0
            groupCount = len(teams)
            while groupId < groupCount:
                if projectsMatchingInfo[projectIndex] > 0:
                    self.groupPairings[groupId] = projectIndex
                    projectsMatchingInfo[projectIndex] -= 1
                    groupId += 1
                else:
                    projectIndex += 1
                if projectIndex >= projectCount:
                    raise Exception("NOT ENOUGH project SLOTS FOR PAIRING")
        else: #Create predefined state
            self.projects = projects
            self.teams = teams
            self.groupPairings = preMade


    def getMostCriticalFourthIndexes(self):
        # using self.teams and self.pairings
        threshhold = len(self.teams)//4
        criticalOnes = []
        #First, I will add all team indexes without a top5 pick.
        for team in self.teams:
            teamID = team.teamId
            clientTeamHasIndex = self.groupPairings[teamID]
            if clientTeamHasIndex not in team.getPrefs():
                criticalOnes.append(teamID)
        if len(criticalOnes) >= threshhold:
            return criticalOnes
        #Now, I will add the other cases, starting with team getting their 5th pick.
        for rankInQuestion in range(4, -1, -1): #4, 3, 2, 1, 0
            for team in self.teams:
                teamID = team.teamId
                clientTeamHasIndex = self.groupPairings[teamID]
                if team.getPrefs()[rankInQuestion] == clientTeamHasIndex:
                    criticalOnes.append(teamID)
            if len(criticalOnes) >= threshhold:
                return criticalOnes
        return criticalOnes

    def maybeGetFromFourth(self, mostCriticalFourthIndexes):
        if random.randint(0,8) < 7:
            return random.choice(mostCriticalFourthIndexes)
        else:
            return random.randint(0, len(self.teams)-1)


    def performCycle(self, cycleCount, mostCriticalFourthIndexes):
        teamsToCycle = []
        while len(teamsToCycle) < cycleCount:
            new = self.maybeGetFromFourth(mostCriticalFourthIndexes)
            if new not in teamsToCycle:
                teamsToCycle.append(new)
        #print(teamsToCycle, cycleCount)
        #Now I will perform the cycle
        saveIndex = teamsToCycle[0]
        save = self.groupPairings[saveIndex]
        for i in range(len(teamsToCycle)-1):
            teamIndex = teamsToCycle[i]
            self.groupPairings[i] = self.groupPairings[i+1] 
        finalTeamIndex = teamsToCycle[len(teamsToCycle)-1]

        self.groupPairings[finalTeamIndex] = save
        #Cycle complete


    def getNumberOfPutOutTeamsOrAFourth(self):
        putOut = self.getNumberOfPutOutTeams()
        fourth = len(self.teams)//4 - 1 
        return min(putOut, fourth)           


    #This changes the current state slightly by moving a team to a different project
    def changeState(self):

        #I will consider prioritising the manipulation of teams that are more critical.


        rand = random.randint(1,3)
        mostCriticalFourthIndexes = self.getMostCriticalFourthIndexes()
        #print(mostCriticalFourthIndexes)
        if rand==1:  #The old way
            #indexToChange = random.choice(mostCriticalFourthIndexes)
            indexToChange = mostCriticalFourthIndexes[random.randint(0, self.getNumberOfPutOutTeamsOrAFourth())]
            newGroupId = random.randint(0, len(self.projects)-1)
            self.groupPairings[indexToChange] = newGroupId #Update a random group to a random project
        elif rand==2:  #Swap 2 teams
            #firstTeamToSwapIndex = random.choice(mostCriticalFourthIndexes)
            firstTeamToSwapIndex = mostCriticalFourthIndexes[random.randint(0, self.getNumberOfPutOutTeamsOrAFourth())]
            secondTeamToSwapIndex = firstTeamToSwapIndex
            while secondTeamToSwapIndex == firstTeamToSwapIndex:
                secondTeamToSwapIndex = random.randint(0, len(self.teams)-1)
            #Now we have them both
            self.groupPairings[firstTeamToSwapIndex], self.groupPairings[secondTeamToSwapIndex] = self.groupPairings[secondTeamToSwapIndex], self.groupPairings[firstTeamToSwapIndex]
        elif rand==3:  #Cycle some teams
            cycleCount = random.randint(3, len(self.teams)-1)
            self.performCycle(cycleCount, mostCriticalFourthIndexes)
    #This finds a neighbooring state that we know to be valid. (ie. constraints are satisfied)
    def getValidNeighboor(self, hoursMax, removed): #"removed" refers to how removed the neighboor is
        while True:
            newState = copy.deepcopy(self)
            for i in range(removed):
                newState.changeState()
            if newState.isUnderHours(hoursMax) and newState.isUnderThresholds():
                return newState #Return as soon as it works


    #This tells the object that it is a solution state, this will matter for printing (the getCost() method)
    def setToFinalState(self):
        self.isFinalState = True

            
    #This ensures that no one project is overwhelmed with teams
    def isUnderThresholds(self):
        projectCounting = [0]*len(self.projects)
        for projectId in self.groupPairings:
            projectCounting[projectId] += 1
        for projectId in range(len(self.projects)):
            if projectCounting[projectId] > self.projects[projectId].getThreshold():
                return False
        return True


    #This ensures that the course coordinator doesn't have too many hours of meetings per week
    def isUnderHours(self, hoursMax): #This checks if there are enough cleins 
        projectsSeen = []
        for projectId in self.groupPairings:
            if projectId not in projectsSeen:
                projectsSeen += [projectId]
        uniqueprojectsCount = len(projectsSeen)
        return uniqueprojectsCount <= hoursMax
    
    def getCost(self): #The cost heuristic - The bigger this number gets, the worse things are.

        #First, I will find the list of extra costs based on the runtimes 
        notInListCost = 20
        totalCost = 0
        for teamId in range(len(self.groupPairings)):
            projectId = self.groupPairings[teamId]
            teamPrefs = self.teams[teamId].getPrefs()
            #print("TeamPrefs,", teamPrefs)
            if not self.isFinalState:
                if projectId == teamPrefs[0]:
                    totalCost += 0
                elif projectId == teamPrefs[1]:
                    totalCost += 1*(1+self.submissionsCosts[teamId])
                elif projectId == teamPrefs[2]:
                    totalCost += 2*(1+self.submissionsCosts[teamId])
                elif projectId == teamPrefs[3]:
                    totalCost += 3*(1+self.submissionsCosts[teamId])
                elif projectId == teamPrefs[4]:
                    totalCost += 4*(1+self.submissionsCosts[teamId])
                else:
                    totalCost += notInListCost*(1+self.submissionsCosts[teamId])
            else:
                if projectId == teamPrefs[0]:
                    totalCost += 0
                elif projectId == teamPrefs[1]:
                    totalCost += 1
                elif projectId == teamPrefs[2]:
                    totalCost += 2
                elif projectId == teamPrefs[3]:
                    totalCost += 3
                elif projectId == teamPrefs[4]:
                    totalCost += 4
                else:
                    totalCost += notInListCost
        return totalCost

    def getAsListOfTups(self):
        return [(index, self.groupPairings[index]) for index in range(len(self.groupPairings))]

    def getNumberOfPutOutTeams(self):
        count = 0
        for team in self.teams:
            teamID = team.teamId
            clientTeamHasIndex = self.groupPairings[teamID]
            if clientTeamHasIndex not in team.getPrefs():
                count+=1
        return count



    #Defines string representation for MatchingState object for printing reasons
    def __str__(self):
        output = "Matching State with cost of: "
        output += str(self.getCost())

        for groupId in range(len(self.groupPairings)):
            output += "\nTeam " + str(groupId) + " is with project " + str(self.groupPairings[groupId])
        return output

class IndexMapper:
    def __init__(self, teamsMappingReferences, projectMappingReferences):
        self.teamsMappingReferences = teamsMappingReferences
        self.projectMappingReferences = projectMappingReferences

        

    def __str__(self):
        output = "TeamIndexes:\n"
        for tup in self.teamsMappingReferences:
            output += str(tup[0]) + " <---> " + str(tup[1]) + "\n"
        output += "ProjectIndexes:\n"
        for tup in self.projectMappingReferences:
            output += str(tup[0]) + "<--->" + str(tup[1]) + "\n"
        return output
    
    def revertTeamIndex(self, teamIndex):
        # (NEW , OLD)
        #print("@", self.teamsMappingReferences, teamIndex)
        for tup in self.teamsMappingReferences:
            if tup[0]==teamIndex:
                return tup[1]
        raise IndexError("Trouble denormalising team indexes")
    
    def revertProjectIndex(self, projectIndex):
        #print("@", self.projectMappingReferences, projectIndex)
        for tup in self.projectMappingReferences:
            if tup[0]==projectIndex:
                return tup[1]
        raise IndexError("Trouble denormalising project indexes")

    def revert(self, outputList):
        newOutput = []
        for tuple in outputList:
            teamIndex, projectIndex = tuple
            newOutput.append((self.revertTeamIndex(teamIndex), self.revertProjectIndex(projectIndex)))
        #print("older input", outputList)
        #print("new thing here",newOutput)    #FIX THIS NEXT TIME, NEW OUTPUT LIST ISNT UPDATING
        return newOutput



def getSubmissionsCosts(submissionsOrder): #This generats the multiplicitave values for the costs, to allow for ties
    placingsRange = len(submissionsOrder)
    #I want to start by nromalising these places around 0-0.1. This means that the team who submitted first has a score of 0.1.
    newValues = [round((0.1 - num*0.1/placingsRange), 2) for num in submissionsOrder]
    return newValues


#Below is the code for the main algorithm
def mainAlg(maxHours, teamInfo, projectTups, submissionsOrder):    

    projects = sorted([Project(projectTup) for projectTup in projectTups])
    teams = sorted([Team((teamKey, teamInfo[teamKey])) for teamKey in teamInfo])
    #print(projects)
    #print(teams)
    submissionsCosts = getSubmissionsCosts(submissionsOrder)
    #print(submissionsCosts)
    initialState = MatchingState(projects, teams, submissionsCosts)  #Create my own one
    #print(initialState)
    #print("Is under hours:", initialState.isUnderHours(maxHours))
    currentCost = initialState.getCost()
    #print("cost:", currentCost)
    currentState = initialState #Sets the initial state to the new "current state"
    hasFinishedAlgortithm = False
    counter = 0
    howLongSinceLastUpdate = 0
    while counter < 1000: #Algorithm runs for 100 iterations
        #print("=============== COUNTER:", counter, "==============")
        #Now we will generate 100 valid neighboor states
        if howLongSinceLastUpdate < 10:
            validNeighboors = [currentState.getValidNeighboor(maxHours, removed=1) for i in range(100)]
        elif howLongSinceLastUpdate < 50:
            validNeighboors = [currentState.getValidNeighboor(maxHours, removed=2) for i in range(100)]
        elif howLongSinceLastUpdate < 100:
            validNeighboors = [currentState.getValidNeighboor(maxHours, removed=3) for i in range(100)]
        elif howLongSinceLastUpdate < 120:
            validNeighboors = [currentState.getValidNeighboor(maxHours, removed=4) for i in range(100)]
        #elif howLongSinceLastUpdate < 150:
        #    validNeighboors = [currentState.getValidNeighboor(maxHours, removed=4) for i in range(100)]
        else:
            currentState.setToFinalState()
            return currentState, currentState.getCost()
        
        #print(counter)
        #Now we will consider if there is a neighbooring state with a better cost
        validNeighboorsCosts = [validNeighboor.getCost() for validNeighboor in validNeighboors]
        #print("CurrentCost:", currentCost)
        #NEIGHBOORS INFO
        #print("NEIGHBOORS INFO")
        #for i in range(100):
        #    print("Neighboor", i, "-", validNeighboors[i])
        #    print("Cost:", validNeighboorsCosts[i])
        bestNewCost = min(validNeighboorsCosts) #Updates the new "best cost"
        if bestNewCost < currentCost:
            bestNewCostIndex = validNeighboorsCosts.index(bestNewCost)
            currentState = validNeighboors[bestNewCostIndex]
            currentCost = bestNewCost
            howLongSinceLastUpdate = 0
        else:
            howLongSinceLastUpdate += 1
        counter += 1
        #print("New Best Cost:", currentCost)
        #print("Number of put out teams:", currentState.getNumberOfPutOutTeams())
        #print("How long since last update", howLongSinceLastUpdate)
        #print("Best new position:", currentState)
    currentState.setToFinalState()
    return currentState, currentState.getCost()
        

#This is a helper function designed to generate most inputs
def inputGetter(projectCount, teamCount, maxHours=math.inf):
    if projectCount<5:
        raise ValueError("Not enough projects for a ranking (less than 5)")
    teamInfo = {}
    for teamIndex in range(teamCount):
        teamInfo[teamIndex] = []
        count = 0
        while count < 5:
            num = random.randint(0, projectCount-1)
            if num not in teamInfo[teamIndex]:
                teamInfo[teamIndex].append(num)
                count += 1
    projectTups = [(i, random.randint(1,4)) for i in range(projectCount)]
    return projectTups, teamInfo, maxHours


def generateSubmissionOrder(teamCount):
    listToShuffle = [num for num in range(teamCount)]
    random.shuffle(listToShuffle)
    return listToShuffle


#This displays info for testing reasons
def printTeamsInfo(teamInfo):
    output = ""
    for teamIndex in range(len(teamInfo)):
        output += "Team " + str(teamIndex) + " prefs: " + str(teamInfo[teamIndex]) + "\n"
    print(output)

#This displays info for testing reasons
def printprojectInfo(projectInfo):
    output = ""
    for projectTup in projectInfo:
        output += "project " + str(projectTup[0]) + " maxTeams: " + str(projectTup[1]) + "\n"
    print(output)


def getNumberOfClientsInvolved(outputList):
    clients = []
    for tup in outputList:
        if tup[1] not in clients:
            clients.append(tup[1])
    return len(clients)

def normalise(teamInfo, projectTups, submissionsOrder):
    #Here, I need to reduce the IDs of the teams to start from zero
    teamsMappingReferences = [] #Tuples (NEW TEAMINDEX, OLD TEAMINDEX)
    #i will start with the teamMappings
    newTeamIndex = 0
    newTeamInfo = {}
    for teamKey in teamInfo:
        teamsMappingReferences.append((newTeamIndex, teamKey))
        newTeamInfo[newTeamIndex] = teamInfo[teamKey]
        newTeamIndex += 1
    #Now I must update the team indexes in the submitions order list
    for i in range(len(submissionsOrder)):
        currentTeamIndex = submissionsOrder[i]
        for tuple in teamsMappingReferences:
            if tuple[1]==currentTeamIndex:
                submissionsOrder[i] = tuple[0]

    #Now, I must normalise the project ids
    newProjectIndex = 0
    newProjectTups = []
    projectMappingReferences = []
    for projectTup in projectTups:
        projectIndex = projectTup[0]
        projectMappingReferences.append((newProjectIndex, projectIndex))
        newProjectTups.append((newProjectIndex, projectTup[1]))
        newProjectIndex += 1
    #Now I must update these names in the teamsInfo
    for teamIndex in teamInfo:
        infoForOneTeam = teamInfo[teamIndex]
        #Now, I need to updata all pjoects indexes
        for i in range(len(infoForOneTeam)):
            currentValue = infoForOneTeam[i]
            #Now, I will look for current value in my existing projMappingRefs
            for tup in projectMappingReferences:
                if tup[1]==currentValue:
                    newValue = tup[0]
                    infoForOneTeam[i] = newValue
        teamInfo[teamIndex] = infoForOneTeam
    return newTeamInfo, newProjectTups, submissionsOrder, IndexMapper(teamsMappingReferences, projectMappingReferences)
        

def getTeamSatisfactions(teamInfo, outputList):
    # print("==========")
    # print(teamInfo)
    # print(outputList)
    # print("==========")
    output = {}
    for teamID in teamInfo:
        for i, tup in enumerate(outputList):
            if tup[0] == teamID:
                indexInOutputList = i
        projectAssignedToTeam = outputList[indexInOutputList][1]
        if teamInfo[teamID][0]==projectAssignedToTeam:
            pref=1
        elif teamInfo[teamID][1]==projectAssignedToTeam:
            pref=2
        elif teamInfo[teamID][2]==projectAssignedToTeam:
            pref=3
        elif teamInfo[teamID][3]==projectAssignedToTeam:
            pref=4
        elif teamInfo[teamID][4]==projectAssignedToTeam:
            pref=5
        else:
            pref=None
        output[teamID] = pref
    return output

def displayTeamSatisfaction(teamsSatisfactionsDict):
    print("="*10 + " Team satisfaction information " + 10*"=")
    for teamID in teamsSatisfactionsDict:
        if teamsSatisfactionsDict[teamID]==1:
            print(teamID, "got their top pick.")
        elif teamsSatisfactionsDict[teamID]==2:
            print(teamID, "got their second pick.")
        elif teamsSatisfactionsDict[teamID]==3:
            print(teamID, "got their third pick.")
        elif teamsSatisfactionsDict[teamID]==4:
            print(teamID, "got their fourth pick.")
        elif teamsSatisfactionsDict[teamID]==5:
            print(teamID, "got their fifth pick.")
        else:
            print(teamID, "did not get any of their top picks.")

def displayFinalOutputList(newOutputList):
    print("=========== Team Pairings information ===========")
    for tup in newOutputList:
        print(tup[0], "is paired with project", tup[1])


def completeAlgorithm(teamInfo, projectTups, submissionsOrder, maxHours):
    # #It's important for each team to have a max threshhold of the number of teams that there are, more than this wouldn't make sense
    # numberOfTeams = len(teamInfo)
    # newProjectTups = []
    # for tup in projectTups:
    #     if tup[1] <= numberOfTeams:
    #         newProjectTups.append(tup)
    #     else:
    #         newProjectTups.append((tup[0], numberOfTeams))



    olderTeamInfo = copy.deepcopy(teamInfo)


    # print("="*30)
    # print("Data before normilisation:")
    # print("teamInfo:",teamInfo)
    # print("projectTups:",projectTups)
    # print("submissions order:", submissionsOrder)
    # print("="*30)


    # print("="*30)
    teamInfo, ProjectTups, submissionsOrder, indexMapper = normalise(teamInfo, projectTups, submissionsOrder)
    # print("="*30)
    # print("after normalisation")
    # print("teamInfo:",teamInfo)
    # print("projectTups:",newProjectTups)
    # print("submissions order:", submissionsOrder)
    # print(indexMapper)
    # print("="*30)

    output, trueCost = mainAlg(maxHours, teamInfo, ProjectTups, submissionsOrder)
    outputList = output.getAsListOfTups()
    newOutputList = indexMapper.revert(outputList)
    teamsSatisfactionsDict = getTeamSatisfactions(olderTeamInfo, newOutputList)


    #print("Final output list", newOutputList)
    #displayFinalOutputList(newOutputList)
    # print("="*10)
    #print("This result had a cost of", trueCost)
    #print(getNumberOfClientsInvolved(newOutputList), "clients are full")
    #displayTeamSatisfaction(teamsSatisfactionsDict)

    return newOutputList, trueCost, teamsSatisfactionsDict


if __name__ == "__main__":
    #print("STARTING MAIN CODE HERE")
    #teamInfo = {0:[1,2,3,4,5], 1: [2,3,4,5,6], 2:[5,4,3,6,7], 3:[5,4,3,7,1], 4:[7,4,0,3,1], 5:[7,3,2,1,5], 6:[7,4,3,1,6]}
    #projectTups = {(0,1), (1,1), (2,1), (3,2), (4,1), (5,2), (6,1), (7,3)}

    #This generates random inputs for algorithm testing

    #projectTups, teamInfo, maxHours = inputGetter(projectCount=42, teamCount=40, maxHours=30)
    #submissionsOrder = generateSubmissionOrder(teamCount=40)

    #submissionsOrder = [0,1,2,3,4,5,6,7,8,9]


    

    # [teamZeroPlace, teamOnePlace, teamTwoPlace ......]

    #printTeamsInfo(teamInfo)
    #printprojectInfo(projectTups)
    #print("maxHours:", maxHours)

    #teamInfo = { 0:[12,14,1,2,3],1:[12,15,9,7,22],2:[15,13,5,22,20],3:[12,13,22,4,19],4:[11,14,13,8,1],5:[7,12,22,15,9],6:[7,12,13,15,5],7:[8,9,18,7,11],8:[5,13,15,1,7],9:[22,7,13,1,12],10:[7,12,16,15,22],11:[10,12,22,16,13],12:[12,22,15,11,13],13:[16,12,22,15,10],14:[22,7,8,15,13],15:[13,22,10,11,12],16:[12,1,3,4,14],17:[1,8,9,12,5],18:[13,22,12,5,7],19:[13,15,19,22,1],20:[12,7,13,15,5],21:[19,21,6,8,2],22:[11,14,7,12,22],23:[10,13,12,14,22],24:[5,13,15,1,7],25:[12,5,22,1,18],26:[12,7,16,18,15],27:[12,16,1,14,13],28:[12,10,22,8,7],29:[1,8,9,11,5],30:[13,22,10,11,12],31:[14,18,22,8,7],32:[13,15,19,22,1],33:[7,13,20,9,22],34:[16,11,17,1,8],35:[12,5,1,14,8],36:[13,22,10,11,12],37:[8,22,5,1,7],38:[12,13,7,5,22],39:[18,15,5,1,13],40:[22,13,7,5,8],41:[5,19,10,11,22],42:[13,9,1,8,5],43:[14,3,5,1,10],44:[19,17,6,5,10] }
    #projectTups = [(i, 6) for i in range(1,23)]
    #maxHours = 20
    #print(projectTups)



    


    #Here, I will normalise the information. TeamInfo, ProejctTups, and SubmissionOrder are important


    # print("="*30)
    # teamInfo = {2:[5,7,12,10,14],
    #             3:[14,13,10,3,5],
    #             4:[3,7,10,13,14],
    #             6:[10,12,14,13,7],
    #             8:[3,5,13,12,7]}
    # projectTups = ((3,1),
    #                (5,2),
    #                (7,2),
    #                (10,3),
    #                (12,2),
    #                (13,2),
    #                (14,2))
    # submissionsOrder = [3,6,8,4,2]
    # maxHours = 4

#     submissionOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
#     teamInfo = {
#     0: [12, 14, 1, 2, 3], 
#     1: [12, 15, 9, 7, 22], 
#     2: [15, 13, 5, 22, 20], 
#     3: [12, 13, 22, 4, 19], 
#     4: [11, 14, 13, 8, 1], 
#     5: [7, 12, 22, 15, 9], 
#     6: [7, 12, 13, 15, 5], 
#     7: [8, 9, 18, 7, 11], 
#     8: [5, 13, 15, 1, 7], 
#     9: [22, 7, 13, 1, 12], 
#     10: [7, 12, 16, 15, 22], 
#     11: [10, 12, 22, 16, 13], 
#     12: [12, 22, 15, 11, 13], 
#     13: [16, 12, 22, 15, 10], 
#     14: [22, 7, 8, 15, 13], 
#     15: [13, 22, 10, 11, 12], 
#     16: [12, 1, 3, 4, 14], 
#     17: [1, 8, 9, 12, 5], 
#     18: [13, 22, 12, 5, 7], 
#     19: [13, 15, 19, 22, 1], 
#     20: [12, 7, 13, 15, 5], 
#     21: [19, 21, 6, 8, 2], 
#     22: [11, 14, 7, 12, 22], 
#     23: [10, 13, 12, 14, 22], 
#     24: [5, 13, 15, 1, 7], 
#     25: [12, 5, 22, 1, 18], 
#     26: [12, 7, 16, 18, 15], 
#     27: [12, 16, 1, 14, 13], 
#     28: [12, 10, 22, 8, 7], 
#     29: [1, 8, 9, 11, 5], 
#     30: [13, 22, 10, 11, 12], 
#     31: [14, 18, 22, 8, 7], 
#     32: [13, 15, 19, 22, 1], 
#     33: [7, 13, 20, 9, 22], 
#     34: [16, 11, 17, 1, 8], 
#     35: [12, 5, 1, 14, 8], 
#     36: [13, 22, 10, 11, 12], 
#     37: [8, 22, 5, 1, 7], 
#     38: [12, 13, 7, 5, 22], 
#     39: [18, 15, 5, 1, 13]
# }
#     maxHours = 20
#     projectTups = [(12, 2), (14, 3), (1, 2), (2, 2), (3, 3), (15, 2), (9, 2), (7, 2), (22, 3), (13, 2), (5, 2), (20, 2), (4, 2), (19, 2), (11, 2), (8, 3), (18, 2), (16, 2), (10, 3), (21, 3), (6, 3), (17, 3)]
#     projectTups = [(tup[0], random.randint(2,4)) for tup in projectTups]


    maxHours = 15
    projectTups = ((1,4),
                (2,4),
                (3,4),
                (4,1),
                (5,4),
                (6,4),
                (7,4),
                (8,1),
                (9,1),
                (10,4),
                (11,4),
                (12,1),
                (13,4),
                (14,4),
                (15,1),
                (16,4),
                (17,4),
                (18,1),
                (19,4),
                (20,4),
                (21,4),
                (22,1),
                (23,4),
                (24,4),
                (25,4),
                (26,math.inf),
                (27,4),
                (28,2),
                (29,4),
                (30,4),
                (31,4),
                (32,2),
                (33,4),
                (34,4),
                (35,1),
                (36,2),
                (37,4),
                (38,1),
                (39,4),
                (40,4),
                (41,4))
    submissionOrder = [n for n in range(42)]
    teamInfo = {0:[32,29,11,13,38],
                1:[41,35,34,13,9],
                2:[2,21,35,10,40],
                3:[24,16,34,32,11],
                4:[15,12,33,23,36],
                5:[9,22,13,6,26],
                6:[13,18,21,35,27],
                7:[34,27,13,26,41],
                8:[10,34,2,7,13],
                9:[21,35,41,4,40],
                10:[35,26,13,24,41],
                11:[15,40,30,2,27],
                12:[35,39,41,20,24],
                13:[35,27,32,38,18],
                14:[20,29,11,18,6],
                15:[13,19,21,38,41],
                16:[17,16,25,19,37]}


    # submissionOrder = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81]

    # teamInfo = {3: [1, 2, 3, 12, 14], 5: [7, 9, 12, 15, 22], 7: [5, 13, 15, 20, 22], 9: [4, 12, 13, 19, 22], 11: [1, 8, 11, 13, 14], 13: [7, 9, 12, 15, 22], 15: [5, 7, 12, 13, 15], 17: [7, 8, 9, 11, 18], 19: [1, 5, 7, 13, 15], 21: [1, 7, 12, 13, 22], 23: [7, 12, 15, 16, 22], 25: [10, 12, 13, 16, 22], 27: [11, 12, 13, 
    # 15, 22], 29: [10, 12, 15, 16, 22], 31: [7, 8, 13, 15, 22], 33: [10, 11, 12, 13, 22], 35: [1, 3, 4, 12, 14], 37: [1, 5, 8, 9, 12], 39: [5, 7, 12, 13, 22], 41: [1, 13, 15, 19, 22], 43: [5, 7, 12, 13, 15], 45: [2, 6, 8, 19, 21], 47: [7, 11, 12, 14, 22], 49: [10, 12, 13, 14, 22], 51: [1, 5, 7, 13, 15], 53: [1, 5, 12, 
    # 18, 22], 55: [7, 12, 15, 16, 18], 57: [1, 12, 13, 14, 16], 59: [7, 8, 10, 12, 22], 61: [1, 5, 8, 9, 11], 63: [10, 11, 12, 13, 22], 65: [7, 8, 14, 18, 22], 67: [1, 13, 15, 19, 22], 69: [7, 9, 13, 20, 22], 71: [1, 8, 11, 16, 17], 73: [1, 5, 8, 12, 14], 75: [10, 11, 12, 13, 22], 77: [1, 5, 7, 8, 22], 79: [5, 7, 12, 13, 22], 81: [1, 5, 13, 15, 18]}

    # projectTups = [(1, 2), (2, 2), (3, 3), (12, 2), (14, 3), (7, 2), (9, 2), (15, 2), (22, 3), (5, 2), (13, 2), (20, 2), (4, 2), (19, 2), (8, 3), (11, 2), (18, 2), (16, 2), (10, 3), (6, 3), (21, 3), (17, 3)]
    # maxHours = 40

    newOutputList, trueCost, teamsSatisfactionsDict = completeAlgorithm(teamInfo, projectTups, submissionOrder, maxHours)

    #print(newOutputList)
    #print(trueCost)
    #print(teamsSatisfactionsDict)

    #print("DONE")

    #Here, the "OUTPUT" includes the "output list" as well as trueCost (whuch is the cost of the solution)






    #project Class
    #projects Class
    #Team Class
    #Teams Class
