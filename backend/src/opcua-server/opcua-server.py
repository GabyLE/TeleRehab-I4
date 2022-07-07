from asyncua import Server, uamethod, ua
from serial import Serial
import asyncio
import os
import logging
# importing ObjectId from bson library
from bson.objectid import ObjectId
import bd
from datetime import datetime

# Create class to wrap serial read and write async
class SafeSerial:
    def __init__(self, url: str, baudrate: int):
        self.url = url
        self.baudrate = baudrate
        self.serial = Serial(url, baudrate)
        self.lock = asyncio.Lock()
        self.status = True

    async def reset(self):
        self.serial = Serial(self.url, self.baudrate)
        self.status = True

    async def readline(self):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.serial.readline)

    async def write(self, data: str):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.serial.write, data)


def create_set_led(serial: SafeSerial):
    @uamethod
    async def set_led(parent, state: bool):
        loop = asyncio.get_event_loop()
        async with serial.lock:
            await serial.write(f"<S1&{int(state)}>".encode())
            res = await serial.readline()
            return not not int(res.decode()[0])

    return set_led

def send_parameters(serial: SafeSerial,flexN,extN,velN,timN,sostN,playN):
    @uamethod
    async def set_params(parent, flex, ext, vel, tiem, sost,play):
        loop = asyncio.get_event_loop()
        async with serial.lock:
            await serial.write(f"<S&{flex}&{ext}&{vel}&{tiem}&{sost}&{play}>".encode())
            res = await serial.readline()
            trama = str(res.decode()).strip()
            arr_vals = getValues(trama, ":", "=")
            flexR = int(arr_vals[0])
            extR = int(arr_vals[1])
            velR = int(arr_vals[2])
            tim = int(arr_vals[3])
            sostR = int(arr_vals[4])
            playR = int(arr_vals[5])
                    
            await flexN.set_value(flexR, ua.VariantType.Int64)
            await extN.set_value(extR, ua.VariantType.Int64)
            await velN.set_value(velR, ua.VariantType.Int64)
            await timN.set_value(tim, ua.VariantType.Int64)
            await sostN.set_value(sostR, ua.VariantType.Int64)
            await playN.set_value(playR, ua.VariantType.Int64)
            return str(res.decode())

    return set_params

def create_get_idSesion(node):
    @uamethod
    async def get_idSesion(parent, id):
        await node.set_value(id, ua.VariantType.String)
        return id
    return get_idSesion


def updateSensors(ang, vel, tempM, incl, tiem, id):
    bd.bd.sesiones.update_one(
        {"_id": ObjectId(id)},
        {'$set': {
            'sensores':{
                'angulo': ang,
                'velocidad': vel,
                'tiempoActual': tiem,
                'inclinacion': incl,
                'temperaturaMotor': tempM,
            }
        }}
    
    )

def updateStates(motor, alin, id):
    bd.bd.sesiones.update_one(
        {"_id": ObjectId(id)},
        {'$set': {
            'estados':{
                'motor': motor,
                'inclinacion': alin
            }
        }}
    )

def getValues(trama, sep1, sep2):
    splited_trama = trama.split(sep1)
    arr_valores = []
    for dato in splited_trama:
        arr_temp = dato.split(sep2)
        #print(arr_temp)
        arr_valores.append(arr_temp[1])

    return arr_valores

def estadoTemperaturaMotor(valor):
    if valor < 300:
        return 1
    elif valor >= 300 and valor:
        return 2

def estadoAlineacion(valor):
    if valor < 300:
        return 1
    elif valor >= 300 and valor:
        return 2

async def main():
    print("Available loggers are: ", logging.Logger.manager.loggerDict.keys())
    # Create serial connection
    serial = SafeSerial(
        os.environ.get("SERIAL") if os.environ.get("SERIAL") else "COM4",
        os.environ.get("BAUD") if os.environ.get("BAUD") else 9600,
    )
    # Initialize OPC-UA Server
    server = Server()
    await server.init()
    server.set_endpoint(
        f"opc.tcp://localhost:{os.environ.get('PORT') if os.environ.get('PORT') else 4840}/freeopcua/server/"
    )
    server.set_server_name("TeleRehab I4")
    # setup namespace
    uri = "telerehab:opcua"
    idx = await server.register_namespace(uri)

    # Populating address space
    # PARAMETROS
    params = await server.nodes.objects.add_object(idx, "Parametros")
    # ID SESION
    params_idSesion = await params.add_variable(idx, "IdSesion","")
    params_idSesion_prop = await params_idSesion.add_property(idx, "IdSesion","identificador")
    await params_idSesion.set_writable()
    # OBTENER ID SESION
    await params.add_method(
        idx,
        "GetIdSesion",
        create_get_idSesion(params_idSesion),
        [ua.VariantType.String],
        [ua.VariantType.String]
    )
    # FLEXION
    params_flexion = await params.add_variable(idx, "Flexion",0)
    params_flexion_prop = await params_flexion.add_property(idx, "Grados","grados")
    await params_flexion.set_writable()
    # EXTENSION
    params_extension = await params.add_variable(idx, "Extension",0)
    params_extension_prop = await params_extension.add_property(idx, "grados","grados")
    await params_extension.set_writable()
    # VELOCIDAD
    params_velocidad = await params.add_variable(idx, "Velocidad",0)
    params_velocidad_prop = await params_velocidad.add_property(idx, "grados/minuto","grados/minuto")
    await params_velocidad.set_writable()
    # TIEMPO SESION
    params_tiempo = await params.add_variable(idx, "Tiempo Sesion",0)
    params_tiempo_prop = await params_tiempo.add_property(idx, "minutos","minutos")
    await params_tiempo.set_writable()
    # SOSTENIMIENTO
    params_sostenimiento = await params.add_variable(idx, "Sostenimiento",0)
    params_sostenimiento_prop = await params_sostenimiento.add_property(idx, "segundos","segundos")
    await params_sostenimiento.set_writable()
    # PLAY
    params_play = await params.add_variable(idx, "Play",0)
    params_play_prop = await params_play.add_property(idx, "entero","entero")
    await params_play.set_writable()
    # ENVIA PARAMS
    await params.add_method(
        idx,
        "SendParams",
        send_parameters(serial, params_flexion, params_extension, params_velocidad, params_tiempo, params_sostenimiento, params_play),
        [ua.VariantType.Int64, ua.VariantType.Int64, ua.VariantType.Int64, ua.VariantType.Int64, ua.VariantType.Int64, ua.VariantType.Int64],
        [ua.VariantType.String]
    )
    # SEGUIMIENTO
    # SENSORES
    sensor = await server.nodes.objects.add_object(idx, "Sensores")
   
    # TEMPERATURA MOTOR
    sensor_tempMotor = await sensor.add_variable(idx, "TempMotor",0)
    sensor_tempMotor_prop = await sensor_tempMotor.add_property(idx, "Celcius","centigrados")
    await sensor_tempMotor.set_writable()
    # TEMPERATURA MOTOR ESTADO
    sensor_tempMotor_estado = await sensor.add_variable(idx, "EstadoTempMotor",0)
    sensor_tempMotor_estado_prop = await sensor_tempMotor_estado.add_property(idx, "Celcius","centigrados")
    await sensor_tempMotor_estado.set_writable()
    # INCLINACION
    sensor_inclinacion = await sensor.add_variable(idx, "Inclinacion",0)
    sensor_inclinacion_prop = await sensor_inclinacion.add_property(idx, "grados","grados")
    await sensor_inclinacion.set_writable()
    # INCLINACION ESTADO
    sensor_inclinacion_estado = await sensor.add_variable(idx, "EstadoInclinacion",0)
    sensor_inclinacion_estado_prop = await sensor_inclinacion_estado.add_property(idx, "grados","grados")
    await sensor_inclinacion_estado.set_writable()
    # ANGULO ACTUAL
    sensor_angulo = await sensor.add_variable(idx, "Angulo Actual",0)
    sensor_angulo_prop = await sensor_angulo.add_property(idx, "grados","grados")
    await sensor_angulo.set_writable()
    # VELOCIDAD
    sensor_velocidad = await sensor.add_variable(idx, "Velocidad Actual",0)
    sensor_velocidad_prop = await sensor_velocidad.add_property(idx, "grados/minuto","grados/minuto")
    await sensor_velocidad.set_writable()
    # TIEMPO
    sensor_tiempo = await sensor.add_variable(idx, "Tiempo",0)
    sensor_tiempo_prop = await sensor_tiempo.add_property(idx, "segundos","segundos")
    await sensor_tiempo.set_writable()
    
   

    node = server.get_objects_node()

    test = await node.add_object(idx, "Test")

    led_state = await test.add_variable(idx, "LEDState", False)
    await test.add_method(
        idx,
        "SetLEDState",
        create_set_led(serial),
        [ua.VariantType.Boolean],
        [ua.VariantType.Boolean],
    )

    # Initialize OPC-UA server
    async with server:
        await asyncio.sleep(0.1)
        # Pool for LED state
        while True:
            await asyncio.sleep(20)
            try:
                status: bool = None
                async with serial.lock:
                    await serial.write(b"<G>")
                    res = await serial.readline()
                    trama = str(res.decode()).strip()
                    arr_vals = getValues(trama, ":", "=")
                    ang = int(arr_vals[0])
                    vel = int(arr_vals[1])
                    tempM = int(arr_vals[2])
                    tiem = int(arr_vals[3])
                    incl = int(arr_vals[4])
                    
                await sensor_tempMotor.set_value(tempM, ua.VariantType.Int64)
                await sensor_inclinacion.set_value(vel, ua.VariantType.Int64)
                await sensor_angulo.set_value(ang, ua.VariantType.Int64)
                await sensor_tiempo.set_value(tiem, ua.VariantType.Int64)
                await sensor_velocidad.set_value(incl, ua.VariantType.Int64)


                 # revisar Temperatura
                temperaturaMotor = await sensor_tempMotor.get_value()
                estadoMotor = estadoTemperaturaMotor(temperaturaMotor)
                await sensor_tempMotor_estado.set_value(estadoMotor, ua.VariantType.Int64)

                # revisar Alineación
                alineacion = await sensor_inclinacion.get_value()
                estadoInclinacion = estadoAlineacion(alineacion)
                await sensor_inclinacion_estado.set_value(estadoInclinacion, ua.VariantType.Int64)

                idSesion = await params_idSesion.get_value()
                print("id sesion: {}".format(idSesion))
                if idSesion != "":
                    updateSensors(ang, vel, tempM, tiem, incl, idSesion)
                    updateStates(estadoMotor, estadoInclinacion,idSesion)


            except Exception as e:
                print(e)


if __name__ == "__main__":
    #logging.basicConfig(level=logging.INFO)
    asyncio.run(main())