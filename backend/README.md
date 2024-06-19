# Backend Services

Python & Flask Based Backend Services
With SQLite/MySQL database accessed through SQLAlchemy

## Setup

Setup program to run in virtual enviroment and install all requisite python plugins using the following

```powershell
cd backend
python -m venv venv

#activating the venv depends on your terminal

source venv\Scripts\activate #for a windows CMD
venv\Scripts\activate.ps1 #for windows powershell
pip install -r requirements.txt #to install required plugins.
```
If your using VSCode use CTRL+SHIFT+P and use the commend Python: Select Interpreter and select .\backend\venv\Scripts\python.exe

Please create a copy of default.env and rename it to .env and set a secret key and fill out any other missing configurations. Also ensure that folder for thast databse exists if not create it, by default it is /backend/dbPackage/database. You can also change the database uri if required.

The backend server will automatically initialise a new database file if it doesn't exist on startup with SQLite selected. With MySQL an empty schema with the configured name must exists for the server to properly initialise. It will automatically populate an empty schema with the appropriate  

## Launching locally

Start into development mode by doing the following:

```powershell
cd .\backend\
flask run --debug
```

## Deploying to AWS Elastic Beanstalk

The first step to deploying to elastic beanstalk is to build the application package by following the commands below. Starting in the root directory of this git repository

```powershell
cd ./backend/
python build.py
```

After following the instructions that appear in your terminal there will be a projectPilot.zip which you can upload and deploy to elastic beanstalk by simply configuring the appropriate environment variables ensuring to select MySQL and setting the connection details correctly for proper data persistence

---

## Contributors

- David (Database)
- Matt (Database)
- Daniel (Algorithm)
- Yashveer (Backend)
- Yifeng Pan (backend)
- Ronald (Frontend)
