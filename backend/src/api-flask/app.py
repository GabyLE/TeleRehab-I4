from socket import timeout
from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from time import sleep

import serial


app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/telerehabbd'
mongo = PyMongo(app)

@app.route('/params', methods=['POST'])
def sendParams():
    print(request.json)
    serial = serial.Serial("COM7", 9600, timeout = 1)
    trama = request.json['trama']
    serial.write(f"<{trama}>".encode())
    return 'received'

@app.route('/params', methods=['GET'])
def getParams():
    return 'received'

if __name__ == "__main__":
    app.run(debug = True)