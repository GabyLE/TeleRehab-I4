from flask import Flask
from flask_pymongo import pymongo
from config.bdConfig import *

CONNECTION_STRING = f"mongodb+srv://{USUARIO}:{CLAVE}@{CLUSTER}.ukelt.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database(BASEDEDATOS)