from backendServer import session
from dbPackage.modelsV2 import User, Client, Admin, Group, Project, Semester
from datetime import datetime


# ***********************************************
#   List Operations for Classes
# ***********************************************

# Returns a list of all Users
def allUsers():
    try:
        users = session.query(User).all()
        return users, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

# Returns a list of all CLients
def allClients():
    try:
        clients = session.query(Client).all()
        return clients, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    
# Returns a list of all Admins
def allAdmins():
    try:
        admins = session.query(Admin).all()
        return admins, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

# Returns a list of all Groups
def allGroups():
    try:
        groups = session.query(Group).all()
        return groups, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

# Returns a list of all Projects
def getAllProjects() -> tuple:
    try:
        projects = session.query(Project).all()
        return projects, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

# Returns a list of all Semesters
def getAllSemesters() -> tuple:
    try:
        semesters = session.query(Semester).all()
        return semesters, 1
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)


# ***********************************************
#   Create Operations for all Classes
# ***********************************************

# Creates a new admin
def newAdmin(username, password, firstName, lastName, email, semester, availableHours=10):
    try:
        admin = Admin(username=username, password=password, firstName=firstName, lastName=lastName, email=email, 
                      availableHours = availableHours, semester=semester)
        session.add(admin)
        session.commit()
        return (admin, 1)
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Creates a new Client
def newClient(username, password, firstName, lastName, email, semester):
    try:
        client = Client(username=username, password=password, firstName=firstName, lastName=lastName, email=email, semester=semester)
        session.add(client)
        session.commit()
        return (client, 1)
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Creates a new Group
def newGroup(username, password, firstName, lastName, email, semester, teamname):
    try:
        group = Group(username=username, password=password, firstName=firstName, lastName=lastName, email=email, semester=semester, teamName=teamname, submissionTime=datetime(3000, 12, 30, 23, 59, 59))
        session.add(group)
        session.commit()
        return (group, 1)
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    
# Creates a new Project
def newProject(title: str, description: str, MVP: str, preferredSkills: str, requiredEquipment: str, 
               numberOfTeams: int, availableResources: str, futureConsideration: bool, additionalInformation: str, client: Client, semester: Semester) -> tuple:
    project = Project(
        title = title,
        description = description,
        MVP = MVP,
        preferredSkills = preferredSkills,
        requiredEquipment = requiredEquipment,
        numberOfTeams = numberOfTeams,
        availableResources = availableResources,
        futureConsideration = futureConsideration,
        status = "pending",
        published = False,
        selected = False,
        additionalInformation = additionalInformation,
        client = client,
        semester = semester)
    try:
        session.add(project)
        session.commit()
        return (project, 1)
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Creates a Semester
def newSemester(name: str) -> tuple:
    semester = Semester(name = name, submissionDeadline = datetime(3000, 12, 30, 23, 59, 59), 
                        preferencesDeadline = datetime(3000, 12, 30, 23, 59, 59), selected = False)
    try:
        session.add(semester)
        session.commit()
        return (semester, 1)
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# ***********************************************
#   Delete Operations for the 3 User Subclasses
# ***********************************************

# Deletes an Admin
def deleteAdmin(id: int):
    try:
        admin = session.query(Admin).filter(Admin.adminId == id).first()
        if admin:
            if len(session.query(Admin).all()) <= 1:
                raise Exception("Error: You cannot delete the only admin")
            session.delete(admin)
            session.commit()
            return ("INFO:Successfully deleted admin", 1)
        else:
            raise Exception("Error: admin not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Deletes a Client
def deleteClient(id: int):
    try:
        client = session.query(Client).filter(Client.clientId == id).first()
        if client:
            if isinstance(client, Admin):
                raise Exception("Error: you are trying to delete an Admin")
            session.delete(client)
            session.commit()
            return ("INFO:Successfully deleted client", 1)
        else:
            raise Exception("Error: client not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Deletes a Group
def deleteGroup(id: int):
    try:
        group = session.query(Group).filter(Group.groupId == id).first()
        if group:
            session.delete(group)
            session.commit()
            return ("INFO:Successfully deleted group", 1)
        else:
            raise Exception("Error: group not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    
# Deletes a Project based on an Id
def deleteProject(id: int) -> tuple:
    try:
        project = session.query(Project).filter(Project.projectId == id).first()
        if project:
            session.delete(project)
            session.commit()
            return ("INFO:Successfully deleted project", 1)
        else:
            raise Exception("Error: Project Not Found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    
# Delete's a Semester as well as everything within it
def deleteSemester(id: int) -> tuple:
    try:
        if len(session.query(Semester).all()) <= 1:
            raise Exception("Error: You cannot delete the only semester")
        semester = session.query(Semester).filter(Semester.semesterId == id).first()
        if semester:
            users = semester.users
            # Removes all users except Admins
            for user in users:
                if user.discriminator != "admins":
                    session.delete(user)
            for project in semester.projects:
                session.delete(project)
            session.delete(semester)
            session.commit()
            return ("INFO:Successfully deleted Semester", 1)
        else:
            raise Exception("Error: Semester not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# *******************************************************
#   Get Operation for all Classes
# *******************************************************

# Returns a User based on the given Id
# Function works for all subclasses
def getUserById(id: int):
    try:
        user = session.query(User).filter(User.userId == id).first()
        if user:
            return (user, 1)
        else:
            raise Exception("Error: user not found")
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    
# Returns a User based on a 
# Function works for all subclasses
def getUserbyUsername(username: str) -> tuple:
    try:
        user = session.query(User).filter(User.username==username).first()
        if user:
            return (user, 1)
        else:
            raise Exception("ERROR: User Not Found")
    except Exception as err:
        return (str(err), 0)
    
# Returns a User based on an email
def getUserByEmail(email: str) -> tuple:
    try:
        user = session.query(User).filter(User.email==email).first()
        if user:
            return (user, 1)
        else:
            raise Exception("ERROR: User Not Found")
    except Exception as err:
        return (str(err), 0)
    
# Returns a list of groups that have selected a project
def getGroupsWithSelectedProject() -> tuple:
    try:
        groups = session.query(Group).filter(Group.selectedProject != None).all()
        return (groups,1)
    except Exception as err:
        return (str(err), 0)
    
# Returns a Project based on an Id
def getProjectById(id: int) -> tuple:
    try:
        project = session.query(Project).filter(Project.projectId == id).first()
        if project:
            return (project, 1)
        else:
            raise Exception("Error: Project Not Found")
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    
# Returns a Semester based on an Id
def getSemesterById(id: int) -> tuple:
    try:
        semester = session.query(Semester).filter(Semester.semesterId==id).first()
        if semester:
            return (semester, 1)
        else:
            raise Exception("Error: Semester not found")
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

def getSemesterByName(name: str) -> tuple:
    try:
        semester = session.query(Semester).filter(Semester.name==name).first()
        if semester:
            return (semester, 1)
        else:
            raise Exception("Error: Semester not found")
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    
def getSelectedSemester() -> tuple:
    try:
        semester = session.query(Semester).filter(Semester.selected==True).first()
        if semester:
            return (semester, 1)
        else:
            raise Exception("Error: Semester not found")
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    
# Returns a list of published projects
def getPublishedProjects(isPublished: bool) -> tuple:
    try:
        projects = session.query(Project).filter(Project.published == isPublished).all()
        return (projects, 1)
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

def getProjectsByStatus(status: str) -> tuple:
    try:
        projects = session.query(Project).filter(Project.status == status).all()
        return (projects, 1)
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)

def getSubmissionOrder() -> tuple:
    try:
        groups = session.query(Group).all()
        sorted_groups = sorted(groups, key=lambda group: group.submissionTime)
        submissionOrder = [group.groupId for group in sorted_groups]
        return (submissionOrder, 1)
    except Exception as err:
        # Catch and return any Error
        return (str(err), 0)
    

    
# ***********************************************
#   Update functions for all Classes
# ***********************************************

# Updates the User's username
def changeUsername(id: int, newUsername: str) -> tuple:
    try:
        user = session.query(User).filter(User.userId == id).first()
        if user:
            user.username = newUsername
            session.commit()
            return ("INFO: Successfully changed username", 1)
        else:
            raise Exception("Error: User not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    
# Updates project atributes
def updateUser(id: int, field: str, newInput) -> tuple:
    try:
        if field == "availableHours":
            admin = session.query(Admin).filter(Admin.adminId == id).first()
            if admin:
                admin.availableHours = newInput
                session.commit()
                return ("INFO: Successfully changed available hours", 1)
            else:
                raise Exception("Error: Admin not found")
        elif field == "teamName":
            group = session.query(Group).filter(Group.groupId == id).first()
            if group:
                group.teamName = newInput
                session.commit()
                return ("INFO: Successfully changed team name", 1)
            else:
                raise Exception("Error: Group not found")
        elif field == "submissionTime":
            group = session.query(Group).filter(Group.groupId == id).first()
            if group:
                group.submissionTime = newInput
                session.commit()
                return ("INFO: Successfully changed submissionTime", 1)
            else:
                raise Exception("Error: Group not found")
        else:
            user = session.query(User).filter(User.userId == id).first()
            if user:
                if field == "username":
                    user.username = newInput
                    session.commit()
                    return ("INFO: Successfully changed username", 1)
                elif field == "password":
                    user.password = newInput
                    session.commit()
                    return ("INFO: Successfully changed password", 1)
                elif field == "email":
                    user.email = newInput
                    session.commit()
                    return ("INFO: Successfully changed email", 1)
                elif field == "firstName":
                    user.firstName = newInput
                    session.commit()
                    return ("INFO: Successfully changed first name", 1)
                elif field == "lastName":
                    user.lastName = newInput
                    session.commit()
                    return ("INFO: Successfully changed last name", 1)
                elif field == "semester":
                    user.semester = newInput
                    session.commit()
                    return ("INFO: Successfully changed semester", 1)
            else:
                raise Exception("Error: User not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Updates Project atributes
def updateProject(id: int, newTitle: str = None, newDescription: str = None, newMVP: str = None, newPreferredSkills: str = None, 
                  newRequiredEquipment: str = None, newNumberOfTeams: int = None, newAvailableResources: str = None,  
                  newFutureConsideration: bool = None, newStatus: str = None, newPublished: bool = None, newSelected: bool = None,
                  newAdditionalInformation: str = None, newClient: Client = None, newSemester: Semester = None, newDisplayNumber: int = None) -> tuple:
    try:
        project = session.query(Project).filter(Project.projectId == id).first()
        if project:
            if newTitle is not None:
                project.title = newTitle
            if newDescription is not None:
                project.description = newDescription
            if newMVP is not None:
                project.MVP = newMVP
            if newPreferredSkills is not None:
                project.preferredSkills = newPreferredSkills
            if newRequiredEquipment is not None:
                project.requiredEquipment = newRequiredEquipment
            if newNumberOfTeams is not None:
                project.numberOfTeams = newNumberOfTeams
            if newAvailableResources is not None:
                project.availableResources = newAvailableResources
            if newFutureConsideration is not None:
                project.futureConsideration = newFutureConsideration
            if newClient is not None:
                project.client = newClient
            if newStatus is not None:
                project.status = newStatus
            if newPublished is not None:
                project.published = newPublished
            if newSelected is not None:
                project.selected = newSelected
            if newAdditionalInformation is not None:
                project.additionalInformation = newAdditionalInformation
            if newSemester is not None:
                project.semester = newSemester
            if newDisplayNumber is not None:
                project.displayNumber = newDisplayNumber

            session.commit()
            return ("Project updated successfully", 1)
        raise Exception("Error: Project Not Found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Add deadline to update 
# datetime formatting -> datetime(year, month, day, hour, minute, second) 
def updateSemester(id: int, newName: str, newSubmissionDeadline: datetime, newPreferencesDeadline: datetime, newSelected: bool) -> tuple:
    try:
        semester = session.query(Semester).filter(Semester.semesterId == id).first()
        if semester:
            if newName is not None:
                semester.name = newName
            if newSubmissionDeadline is not None:
                if isinstance(newSubmissionDeadline, datetime):
                    semester.submissionDeadline = newSubmissionDeadline
                else:
                    raise Exception("Error: submissionDeadline not a real datetime")
            if newPreferencesDeadline is not None:
                if isinstance(newPreferencesDeadline, datetime):
                    semester.preferencesDeadline = newPreferencesDeadline
                else:
                    raise Exception("Error: submissionDeadline not a real datetime")
            if newSelected is not None:
                if newSelected == True:
                    semesters = semesters = session.query(Semester).all()
                    for sem in semesters:
                        sem.selected = False
                semester.selected = newSelected
            session.commit()
            return ("Semester updated successfully", 1)
        else:
            raise Exception("Error: Semester Not Found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

def incrememntProjectCount(id: int) -> int:
    try:
        semester = session.query(Semester).filter(Semester.semesterId == id).first()
        semester.projectCount += 1
        session.commit()
        return semester.projectCount
    except:
        return ("Error: Semester Not Found")



# ***********************************************
#   Other Useful Functions
# ***********************************************

# Adds Project preferences to a group
def addPreferences(id: int, projects: list) -> tuple:
    try:
        group = session.query(Group).filter(Group.groupId == id).first()
        if group:
            clearPreferences(id)
            group.submissionTime = datetime.now()
            for projectId in projects:
                project = session.query(Project).filter(Project.projectId == projectId).first()
                if project:
                    group.projectPreferences.append(project)
                else:
                    raise Exception("Error: Project not found")
            session.commit()
            return ("Preference added successfully", 1)
        else:
            raise Exception("Error: Group not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

# Function that clears all preferences from a group
def clearPreferences(id: int) -> tuple:
    try:
        group = session.query(Group).filter(Group.groupId == id).first()
        if group:
            group.projectPreferences.clear()
            return ("Project preferences cleared successfully", 1)
        else:
            raise Exception("ERROR: Group not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)

    
# Assigns a project to a group
def assignProject(projectId: int, groupId: int) -> tuple:
    try:
        group = session.query(Group).filter(Group.groupId == groupId).first()
        if group:
            project = session.query(Project).filter(Project.projectId == projectId).first()
            if project:
                group.selectedProject = project
            else:
                raise Exception("Error: Project not found")
            # Assigns the project's client to the group
            client = session.query(Client).filter(Client.clientId == project.clientId).first()
            if client:
                group.client = client
            else:
                raise Exception("Error: Client not found")
            session.commit()
            return ("Project assigned successfully", 1)
        else:
            raise Exception("Error: Group not found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    
# Populates the semester object with previous semester's future considerations
def populateSemester(previousSemesterId: int, currentSemesterId: int) -> tuple:
    try:
        previousSemester = session.query(Semester).filter(Semester.semesterId == previousSemesterId).first()

        # If no previousSemester don't populate
        if previousSemester:
            semester = session.query(Semester).filter(Semester.semesterId == currentSemesterId).first()
            if semester:
                # Assign semester name
                previousNameList = previousSemester.name.split()
                if int(previousNameList[2]) == 1:
                    semester.name = previousNameList[0] + " Semester " + "2"
                else:
                    year = int(previousNameList[0]) + 1
                    semester.name = str(year) + " Semester " + "1"

                # Populates all projects as well as clients
                for project in previousSemester.projects:
                    if project.futureConsideration and not project.approved:
                        if project.client not in semester.clients:
                            project.client.semester = semester
                            semester.clients.append(project.client)
                        project.semester = semester
                        semester.projects.append(project)
            else:
                raise Exception("Error: Semester not found")
            session.commit()
            return ("Successfully populated Semester", 1)
        else:
            raise Exception("Error: No previous semester found")
    except Exception as err:
        #revert any erroneous changes this session
        session.rollback()
        return (str(err), 0)
    


    



    