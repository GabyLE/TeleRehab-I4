from flask import Flask, request, jsonify
from flask_cors import CORS
# importing ObjectId from bson library
from bson.objectid import ObjectId
import bd
import asyncio
import clienteOpcua
import bcrypt


app = Flask(__name__)

CORS(app)

# coleccion usuarios
usuarios = bd.db.usuarios
# coleccion sesiones
sesiones = bd.db.sesiones
# colección data
data = bd.db.data
# USUARIO
@app.route("/usuarios/registro", methods=['POST'])
def registrar_usuario():
    mensaje = ''

    if request.method == 'POST':
        registro = request.json['Registro']
        nombre = registro['Nombre']
        tipoDocumento = registro['TipoDoc']
        numDocumento = registro['NumDoc']
        email = registro['Email']
        tipo = registro['Tipo']
        clave1 = registro['Clave1']
        clave2 = registro['Clave2']

        documento_encontrado = usuarios.find_one({'numDocumento': numDocumento})
        email_encontrado = usuarios.find_one({'email': email})

        if documento_encontrado:
            mensaje = 'Ya hay un usuario registrado con ese documento'
            return mensaje
        elif email_encontrado:
            mensaje = 'El email ya existe'
            return mensaje
        elif clave1 != clave2:
            mensaje = 'Las constraseñas no coinciden'
            return mensaje
        else:
            hashed = bcrypt.hashpw(clave2.encode('utf-8'), bcrypt.gensalt())
            usuario = {
                'nombre': nombre,
                'email': email,
                'numDocumento': numDocumento,
                'tipoDocumento': tipoDocumento,
                'tipo': tipo,
                'clave': hashed
                }
            _id = usuarios.insert_one(usuario).inserted_id
            usuario_data = usuarios.find_one({'numDocumento': numDocumento})
            res = {
                'Nombre': usuario_data['nombre'],
                'Email': usuario_data['email'],
                'Id': str(_id),
                'NumDoc': usuario_data['numDocumento'],
                'Tipo': usuario_data['tipo']
            }
            return jsonify(res)

@app.route('/usuarios/login', methods=['POST'])
def login():

    res = ''

    login = request.json['Login']
    email = login['Email']
    clave = login['Clave']

    email_encontrado = usuarios.find_one({'email': email})

    if email_encontrado:
        email_val = email_encontrado['email']
        clave_encrypted = email_encontrado['clave']

        if bcrypt.checkpw(clave.encode('utf-8'), clave_encrypted):
            res = {
                'Id': str(email_encontrado['_id']),
                'Nombre': email_encontrado['nombre'],
                'Email': email_val,
                'NumDoc': email_encontrado['numDocumento'],
                'Tipo': email_encontrado['tipo']
            }
            return jsonify(res)
        else:
            res = 'Credenciales no válidas'
            return jsonify(res)
    else:
        res = 'Credenciales no válidas'
        return jsonify(res)

@app.route('/pacientes', methods=['POST'])
def add_pacient():
    paciente = request.json['Paciente']
    paciente_doc = {
        'nombre': paciente['Nombre'],
        'email': paciente['Email'],
        'numDocumento': paciente['NumDoc'],
        'tipoDocumento': paciente['TipoDoc'],
        'tipo': 'Paciente',
        'residencia': paciente['Residencia'],
        'edad': paciente['Edad']
    }
    
    _id = usuarios.insert_one(paciente_doc).inserted_id
    idPaciente = str(_id)
    return jsonify(idPaciente)

@app.route('/sesion/md', methods=['POST'])
def add_session_md():
    res = ''
    sesion = request.json['Sesion']
    medico = usuarios.find_one({'numDocumento': sesion['IdMedico']})
    paciente = usuarios.find_one({'numDocumento': sesion['IdPaciente']})
    sesion_doc = {
        'fecha': sesion['Fecha'],
        "paciente": {
            "nombre": paciente['nombre'],
            'tipoDocumento': paciente['tipoDocumento'],
            'numDocumento': paciente['numDocumento'],
            'email': paciente['email'],
            'edad': paciente['edad'],
            'residencia': paciente['residencia']
        },
        'medico': {
            'nombre': medico['nombre'],
            'numDocumento': medico['numDocumento'],
            'email': medico['email']
        }
    }
    _id = sesiones.insert_one(sesion_doc).inserted_id
    data.insert_one({
        'id_sesion': str(_id),
        'angulo': [],
        'velocidad': [],
        'tiempoActual': [],
        'inclinacion': [],
        'temperaturaMotor': [],
        'estadoMotor':[],
        'estadoInclinacion':[]
        })
    idSesion = {'objId':str(_id)}
    resServ = asyncio.run(clienteOpcua.send_id(str(_id)))
    if resServ == "Error servidor":
        res = 'Error servidor'
    else:
        res = idSesion
    return jsonify(res)

@app.route('/sesion/tc', methods=['POST'])
def add_session_tc():
    res = ''
    sesion = request.json['Sesion']
    tecnico = usuarios.find_one({'numDocumento': sesion['IdTecnico']})
    sesion_doc = {
        'fecha': sesion['Fecha'],
        'monitoreo':1,
        'tecnico': {
            'nombre': tecnico['nombre'],
            'numDocumento': tecnico['numDocumento'],
            'email': tecnico['email']
        }
    }
    _id = sesiones.insert_one(sesion_doc).inserted_id
    data.insert_one({
        'id_sesion': str(_id),
        'angulo': [],
        'velocidad': [],
        'tiempoActual': [],
        'inclinacion': [],
        'temperaturaMotor': [],
        })
    idSesion = {'objId':str(_id)}
    resServ = asyncio.run(clienteOpcua.send_id(str(_id)))
    if resServ['mensaje'] == "Error servidor":
        res = resServ['error']
    elif resServ['mensaje'] == 'OK':
        res = idSesion
    return jsonify(res)

@app.route('/params', methods=['POST'])
def update_params():
    res = ''
    params = request.json['params']
    flex = params['flexion']
    ext = params['extension']
    vel = params['velocidad']
    tim = params['tiempoSost']
    play = params['play']
    sost = params['tiempoSesion']
    sesiones.update_one(
        {"_id": ObjectId(params['_id'])},
        {'$set': {
            'parametros':{
                'flexion': flex,
                'extension': ext,
                'tiempoSostenimiento': tim,
                'velocidad': vel,
                'play': play,
                'tiempoSesion': sost
            }
        }}
    )
    resServ =asyncio.run(clienteOpcua.set_params(flex, ext, vel, tim, sost, play))
    if resServ['mensaje'] == "Error servidor":
        res = resServ['error']
    elif resServ['mensaje'] == 'OK':
        res = 'Parámetros de la sesion actualizados'
    
    return jsonify(res)

@app.route('/observacion', methods=['POST'])
def updateObservaciones():
    obs = request.json
    print(obs)
    sesiones.update_one(
        {"_id": ObjectId(obs['Obs']['ObjId'])},
        {'$set':
            {
                'observacion': obs['Obs']['Observacion']
            }
        }
    )
    return jsonify("Observación guardada")

# @app.route('/conectar', methods=['GET'])
# def conectar():
#     resServ = asyncio.run(clienteOpcua.set_let())
#     if resServ == "Error servidor":
#         res = 'Error servidor'
#     else:
#         res = resServ
#     return jsonify(res)




@app.route('/params/iniciar/<id>', methods=['GET'])
def iniciar(id):
    res =''
    params = sesiones.find_one({'_id': ObjectId(id)}, {'parametros': 1})
    flex = params['parametros']['flexion']
    ext = params['parametros']['extension']
    vel = params['parametros']['velocidad']
    tim = params['parametros']['tiempoSesion']
    sost = params['parametros']['tiempoSostenimiento']
    resServ =asyncio.run(clienteOpcua.set_params(flex, ext, vel, tim, sost, 1))
    if resServ['mensaje'] == "Error servidor":
        res = resServ['error']
    elif resServ['mensaje'] == 'OK':
        res = {'respuestaServidor': 'Sesión iniciada'}
    
    return jsonify(res)

@app.route('/params/pausar/<id>', methods=['GET'])
def pausar(id):
    res=''
    params = sesiones.find_one({'_id': ObjectId(id)}, {'parametros': 1})
    flex = params['parametros']['flexion']
    ext = params['parametros']['extension']
    vel = params['parametros']['velocidad']
    tim = params['parametros']['tiempoSesion']
    sost = params['parametros']['tiempoSostenimiento']
    resServ =asyncio.run(clienteOpcua.set_params(flex, ext, vel, tim, sost, 3))
    if resServ['mensaje'] == "Error servidor":
        res = resServ['error']
    elif resServ['mensaje'] == 'OK':
        res = {'respuestaServidor': 'Sesión pausada'}
    
    return jsonify(res)
    
@app.route('/params/terminar/<id>', methods=['GET'])
def terminar(id):
    res = ''
    params = sesiones.find_one({'_id': ObjectId(id)}, {'parametros': 1})
    flex = params['parametros']['flexion']
    ext = params['parametros']['extension']
    vel = params['parametros']['velocidad']
    tim = params['parametros']['tiempoSesion']
    sost = params['parametros']['tiempoSostenimiento']
    resServ =asyncio.run(clienteOpcua.set_params(flex, ext, vel, tim, sost, 4))
    if resServ['mensaje'] == "Error servidor":
        res = resServ['error']
    elif resServ['mensaje'] == 'OK':
        res = {'respuestaServidor': 'Sesión terminada'}
    
    return jsonify(res)
    

@app.route('/observacion/<id>', methods=['GET'])
def getObservaciones(id):
    observaciones = []
    # print(sesiones.find({'observacion': { '$exists': True }}, {'observacion': 1, '_id':0, 'fecha':1}))
    for doc in sesiones.find({ 'numDocumento':id, 'observacion': { '$exists': True }}, {'observacion': 1, '_id':0, 'fecha':1}):
        observaciones.append(doc)
  
    return jsonify(observaciones)

@app.route('/pacientes', methods=['GET'])
def getPacientes():
    pacientes = []
    for doc in usuarios.find({'tipo': 'Paciente'}):
        paciente = {
            'nombre':doc['nombre'],
            'id':doc['numDocumento'],
            'edad' :doc['edad'],
            'residencia':doc['residencia'],
            'tipoDocumento' : doc['tipoDocumento'],
            'email' : doc['email'],
            'objId': str(doc['_id'])
        }
        pacientes.append(paciente)
        
    return jsonify(pacientes)

@app.route('/sensores/actualizar/<id>', methods=['GET'])
def actualizar_sensores(id):
    sensores = sesiones.find_one({'_id': ObjectId(id)}, {'sensores': 1})
    ang = sensores['sensores']['angulo']
    corr = sensores['sensores']['corriente']
    tiem = sensores['sensores']['tiempoActual']
    incl = sensores['sensores']['inclinacion']
    tempM = sensores['sensores']['temperaturaMotor']

    res = [
        {
            'angulo': ang,
            'corriente': corr,
            'tiempoActual': tiem,
            'inclinacion': incl,
            'temperaturaMotor': tempM
        }
    ] 
    
    
    return jsonify(res)

@app.route('/sensores/estados/<id>', methods=['GET'])
def actualizarEstados(id):
    estados = sesiones.find_one({'_id': ObjectId(id)}, {'estados': 1})
    motor = estados['estados']['motor']
    alin = estados['estados']['inclinacion']
    
    res = [
        {
            'motor': motor,
            'alineacion': alin
            
        }
    ] 
    
    
    return jsonify(res)


if __name__ == "__main__":
    app.run(debug = True)