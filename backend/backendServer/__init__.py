import os
from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from dbPackage.modelsV2 import Base, Admin, Semester
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from firebase_admin import initialize_app, credentials
cred = credentials.Certificate("auth399-firebase-adminsdk-vbsfy-157c23c385.json")


def createDB(engine, username: str, password: str, firstName: str, lastName: str, email: str, availableHours: int, semesterName: str) -> None:
    '''
    Populate an empty database with appropriate schema and a default semester and admin of the passed details 
    '''

    #Populate schema using sqlalchemy orm
    Base.metadata.create_all(engine)

    #Setup session, create and add admin and semester objects
    Session = sessionmaker(bind=engine)
    session = Session()
    semester = Semester(name=semesterName, submissionDeadline=datetime.now(), preferencesDeadline=datetime.now(), selected=True)
    admin = Admin(username=username, password=password, firstName=firstName, lastName=lastName, email=email, availableHours=availableHours, semester=semester)
    session.add(semester)
    session.add(admin)

    #Cleanup
    session.commit()
    session.close()

    print("Tables created successfully and admin initialized.")

#verifying .env exists and loading it
dotenvPath = os.path.join(os.getcwd(),".env")
if not os.path.exists(dotenvPath):
    raise RuntimeError("ERROR:Missing .env file. Please create a .env file in the /backend directory")
load_dotenv(dotenvPath)

#initalising flask app and middleware
app = Flask(__name__)
CORS(app)
initialize_app(cred)


#loading app configs from .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
devUIEnabled = False

#checking for a blank secretKey
if not app.config['SECRET_KEY']:
    raise RuntimeError("ERROR:SECRET_KEY is not set in the .env file.")

#check type of db configured for and setup appropriately
if os.getenv('DBTYPE') == "MYSQL":

    # DEFINE THE DATABASE CREDENTIALS
    dbuser = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    host = os.getenv('DB_HOST')
    port = os.getenv('DB_PORT')
    database = os.getenv('DATABASE')

    #build the db string and configure sqlalchemy with it
    url="mysql+pymysql://{0}:{1}@{2}:{3}/{4}".format(dbuser, password, host, port, database)
    app.config['SQLALCHEMY_DATABASE_URI'] = url

#setup sqlalchemy db URI for sqlite
elif os.getenv('DBTYPE')  == "SQLITE":
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLITE_DATABASE_URI')

else:
    raise RuntimeError("ERROR: Database type not configured in environment variables")

#Initialise DB and DB Engine
print(f"INFO: Starting with {os.getenv('DBTYPE')}")
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

#check if db exists if not make one
inspector = inspect(engine)
if not inspector.has_table("admins"):
    print("DB doesn't exist. A new DB will now be initialised and admin user created")
    username = os.getenv('ADMIN_USERNAME')
    password = os.getenv('ADMIN_PASSWORD')
    firstName = os.getenv('ADMIN_FNAME')
    lastName = os.getenv('ADMIN_LNAME')
    email = os.getenv('ADMIN_EMAIL')
    availableHours = int(os.getenv('ADMIN_HOURS'))
    semName = os.getenv('SEMESTER_NAME')
    createDB(engine, username, password, firstName, lastName, email, availableHours, semName)

#create the session object for the database to use.
session = Session(bind=engine)

#Importing flask routes
from backendServer.routes import algorithm, projects, user, exampleDataRoute, semester, authentication
