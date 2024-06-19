from sqlalchemy import Column, ForeignKey, Integer, String, Table, ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase
from typing import List, Optional
from datetime import datetime, date
import json

class Base(DeclarativeBase):
    pass


projectPreferenceAssociation = Table(
    'projectPreferencesAssociation', Base.metadata,
    Column('projectId', ForeignKey('projects.projectId'), primary_key=True),
    Column('groupId', ForeignKey('groups.groupId'), primary_key=True)
)

clientGroupAssociation = Table(
    'clientGroupAssociation',
    Base.metadata,
    Column('clientId', Integer, ForeignKey('clients.clientId')),
    Column('groupId', Integer, ForeignKey('groups.groupId'))
)

class User(Base):
    __tablename__ = 'users'

    userId:Mapped[int] = mapped_column(primary_key=True)
    firstName:Mapped[str] = mapped_column(String(length=50))
    lastName:Mapped[str] = mapped_column(String(length=50))
    email:Mapped[str] = mapped_column(String(length=100), unique=True)
    username:Mapped[str] = mapped_column(String(length=50), unique=True)
    password:Mapped[str] = mapped_column(String(length=50))
    discriminator:Mapped[str] = mapped_column(String(length=20))
    semesterId: Mapped[int] = mapped_column(ForeignKey('semesters.semesterId'), nullable=True)
    semester: Mapped['Semester'] = relationship(back_populates='users')

    __mapper_args__ = {
        'polymorphic_identity': 'users',
        'polymorphic_on': discriminator
    }

    def __repr__(self) -> str:
        return f"<User username={self.username}>"
    
    def to_dict(self) -> dict:
        return {
            "userId": self.userId,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "username": self.username,
            "semester": self.semesterId
        }
    
class Client(User):
    __tablename__ = 'clients'

    clientId:Mapped[int] = mapped_column(ForeignKey("users.userId"), primary_key=True)
    projects:Mapped[List['Project']] = relationship(back_populates='client', cascade="all, delete")
    groups:Mapped[List['Group']] = relationship(secondary=clientGroupAssociation, back_populates='client')

    __mapper_args__ = {
        'inherit_condition': clientId == User.userId, 
        'polymorphic_identity': 'clients'
    }
    
    def to_dict(self) -> dict:
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "username": self.username,
            "clientId": self.clientId,
            "projects": [project.projectId for project in self.projects],
            "groups": [group.groupId for group in self.groups],
            "semester": self.semesterId
        }

class Admin(Client):
    __tablename__ = 'admins'

    adminId:Mapped[int] = mapped_column(ForeignKey("clients.clientId"), primary_key=True)
    availableHours:Mapped[int]


    __mapper_args__ = {
        'inherit_condition': adminId == Client.clientId,
        'polymorphic_identity': 'admins'
    }

    def to_dict(self) -> dict:
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "username": self.username,
            "adminId": self.adminId,
            "availableHoure": self.availableHours,
            "projects": [project.projectId for project in self.projects],
            "groups": [group.groupId for group in self.groups],
            "semester": self.semesterId
        }

class Group(User):
    __tablename__ = 'groups'

    groupId:Mapped[int] = mapped_column(ForeignKey("users.userId"), primary_key=True)
    teamName:Mapped[str] = mapped_column(String(length = 100), nullable=True, unique=True)
    client:Mapped['Client'] = relationship(secondary=clientGroupAssociation, back_populates='groups')
    submissionTime:Mapped[datetime]
    projectPreferences:Mapped[List['Project']] = relationship(secondary=projectPreferenceAssociation, back_populates='groupPreferences')
    selectedProjectId:Mapped[Optional[int]] = mapped_column(ForeignKey('projects.projectId'))
    selectedProject:Mapped[Optional['Project']] = relationship(back_populates='selectedGroups')

    __mapper_args__ = {
        'inherit_condition': groupId == User.userId,
        'polymorphic_identity': 'groups'
    }

    def __repr__(self) -> str:
        return f"<User teamName={self.teamName}>"

    def to_dict(self) -> dict:
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "username": self.username,
            "groupId": self.groupId,
            "teamName": self.teamName,
            "submissionTime": self.submissionTime,
            "selectedProjectId": self.selectedProjectId,
            "projectPreferences": [project.projectId for project in self.projectPreferences],
            "semester": self.semesterId
        }
    
class Project(Base):
    __tablename__ = 'projects'

    projectId:Mapped[int] = mapped_column(primary_key=True)
    displayNumber:Mapped[int] = mapped_column(nullable=True)
    title:Mapped[str] = mapped_column(String(length = 500), nullable=True, unique=True)
    description:Mapped[str] = mapped_column(String(length = 1000), nullable=True)
    MVP:Mapped[str] = mapped_column(String(length = 1000), nullable=True)
    preferredSkills:Mapped[str] = mapped_column(String(length = 1000), nullable=True)
    requiredEquipment:Mapped[str] = mapped_column(String(length = 1000), nullable=True)
    numberOfTeams:Mapped[int] = mapped_column(nullable=True)
    availableResources:Mapped[str] = mapped_column(String(length = 1000), nullable=True)
    futureConsideration:Mapped[bool]
    status:Mapped[str] = mapped_column(String(length = 50))
    published:Mapped[bool]
    selected:Mapped[bool]
    additionalInformation = Column(String(length=1000), nullable=True)  
    clientId:Mapped[int] = mapped_column(ForeignKey('clients.clientId'))
    client:Mapped['Client'] = relationship(back_populates='projects', passive_deletes=True)
    groupPreferences:Mapped[List['Group']] = relationship(secondary=projectPreferenceAssociation, back_populates='projectPreferences')
    selectedGroups:Mapped[List['Group']] = relationship(back_populates='selectedProject')

    semesterId: Mapped[int] = mapped_column(ForeignKey('semesters.semesterId'), nullable=True)
    semester: Mapped['Semester'] = relationship(back_populates='projects')

    __mapper_args__ = {
        'primary_key': [projectId]
    }

    def __repr__(self) -> str:
        return f"<Project title={self.title}>"
    
    def to_dict(self) -> dict:
        addInfo = None
        if self.additionalInformation is not None:
            addInfo = json.loads(self.additionalInformation)
        return {
            "projectId": self.projectId,
            "displayNumber": self.displayNumber,
            "title": self.title,
            "description": self.description,
            "MVP": self.MVP,
            "preferedSkills": self.preferredSkills,
            "requiredEquipment": self.requiredEquipment,
            "numberOfTeams": self.numberOfTeams,
            "availableResouces": self.availableResources,
            "futureConsideration": self.futureConsideration,
            "status": self.status,
            "selected": self.selected,
            "additionalInformation": addInfo,
            "clientId": self.clientId,
            "semesterId": self.semesterId,
            "published": self.published
        }
    

class Semester(Base):
    __tablename__ = 'semesters'

    semesterId: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(length=20), unique=True)
    submissionDeadline: Mapped[datetime]
    preferencesDeadline: Mapped[datetime]
    selected:Mapped[bool]


    users: Mapped[List['User']] = relationship(back_populates='semester', overlaps="clients, admins, groups")
    clients: Mapped[List['Client']] = relationship(back_populates='semester', foreign_keys='[Client.semesterId]', overlaps="users")
    admins: Mapped[List['Admin']] = relationship(back_populates='semester', foreign_keys='[Admin.semesterId]', overlaps="clients")
    groups: Mapped[List['Group']] = relationship(back_populates='semester', foreign_keys='[Group.semesterId]', overlaps="users")
    projects: Mapped[List['Project']] = relationship(back_populates='semester', foreign_keys='[Project.semesterId]', overlaps="users")
    
    __mapper_args__ = {
        'primary_key': [semesterId]
    }

    def __repr__(self) -> str:
        return f"<Semester name={self.name} semesterId={self.semesterId}>"

    def to_dict(self) -> dict:
        return {
            "semesterId": self.semesterId,
            "projectCount": self.projectCount,
            "name": self.name,
            "submissionDeadline": self.submissionDeadline.isoformat(),
            "preferencesDeadline": self.preferencesDeadline.isoformat(),
            "selected": self.selected,
            "users": [user.userId for user in self.users],
            "clients": [client.clientId for client in self.clients],
            "admins": [admin.adminId for admin in self.admins],
            "groups": [group.groupId for group in self.groups],
            "projects": [project.to_dict() for project in self.projects]
        }