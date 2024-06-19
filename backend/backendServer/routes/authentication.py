from backendServer import app, session
from flask import request, Response
from firebase_admin import credentials, auth
from werkzeug.security import generate_password_hash, check_password_hash
from dbPackage import interface_v2 as interface
import json

from dbPackage.modelsV2 import User

@app.route('/registergroup', methods=['POST'])
def registergroup():

    data = request.json
    if not data:
        return ({'error': 'No data received'}), 400
    
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    semesterId = data.get('semesterId')

    if not email or not password or not username or not firstName or not lastName:
        return ({'error': 'missing fields'}),400

    try:
        # Create user in Firebase Authentication
        user = auth.create_user(email=email, password=password)
        semester, status = interface.getSemesterById(semesterId)
        # Save additional user data to your own database

        msg, stat = interface.newGroup(username=username,password=password,firstName=firstName,lastName=lastName,email=email,semester=semester, teamname="default")
        print(msg)
        print(username,password,firstName,lastName,email,semester)
        return 'User created successfully'
    except Exception as e:
        return str(e)
    

@app.route('/registerclient', methods=['POST'])
def registerclient():

    data = request.json
    if not data:
        return ({'error': 'No data received'}), 400
    
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    semesterId = data.get('semesterId')

    if not email or not password or not username or not firstName or not lastName:
        return ({'error': 'missing fields'}),400

    try:
        # Create user in Firebase Authentication
        user = auth.create_user(email=email, password=password)
        semester, status = interface.getSemesterById(semesterId)
        # Save additional user data to your own database

        msg, stat = interface.newClient(username=username,password=password,firstName=firstName,lastName=lastName,email=email,additionalInformation="", semester=semester)
        print(msg)
        print(username,password,firstName,lastName,email,semester)
        return 'User created successfully'
    except Exception as e:
        return str(e)
    
@app.route('/registeradmin', methods=['POST'])
def registeradmin():

    data = request.json
    if not data:
        return ({'error': 'No data received'}), 400
    
    email = request.json['email']
    password = request.json['password']
    try:
        # Create user in Firebase Authentication
        user = auth.create_user(email=email, password=password)
        return {'message':'User created successfully', 'uid': user.uid}, 200
    except Exception as e:
        return str(e)

@app.route('/userInfo', methods=['POST'])
def getUserInfo():
    firebase_email = request.json.get('firebaseEmail')

    # Query database to get user information based on email
    user = session.query(User).filter_by(email=firebase_email).first()

    if user:
        # Construct user info response
        response_data = {
            'userId': user.userId,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'username': user.username,
            'discriminator': user.discriminator,
            # Include other user attributes as needed
        }
        return Response(json.dumps(response_data), status=200, mimetype='application/json')
    else:
        error_data = {'error': 'User not found'}
        return Response(json.dumps(error_data), status=404, mimetype='application/json')




