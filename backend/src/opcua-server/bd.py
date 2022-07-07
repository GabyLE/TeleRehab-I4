from flask import Flask
from flask_pymongo import pymongo


PUERTO = "27017"
CLUSTER = "misiontic"
BASEDEDATOS = "teleRehabI4"
USUARIO = "gabyle"
CLAVE = "AnubiS.971031"

CONNECTION_STRING = f"mongodb+srv://{USUARIO}:{CLAVE}@{CLUSTER}.ukelt.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
bd = client.get_database(BASEDEDATOS)