import random, math

def inputGetter(clientCount, teamCount, maxHours=math.inf):
    teamInfo = {}
    for teamIndex in range(teamCount):
        teamInfo[teamIndex] = [random.randint(0, clientCount-1) for i in range(5)]
    clientTups = [(i, random.randint(1,4)) for i in range(clientCount)]
    return clientCount, teamCount, maxHours
