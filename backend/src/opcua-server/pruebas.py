import asyncio
import copy
import logging
from datetime import datetime
import time
from math import sin


from asyncua import ua, uamethod, Server


class SubHandler(object):

    """
    Subscription Handler. To receive events from server for a subscription
    """

    def datachange_notification(self, node, val, data):
        print("Python: New data change event", node, val)

    def event_notification(self, event):
        print("Python: New event", event)


# method to be exposed through server

def func(parent, variant):
    ret = False
    if variant.Value % 2 == 0:
        ret = True
    return [ua.Variant(ret, ua.VariantType.Boolean)]


# method to be exposed through server
# uses a decorator to automatically convert to and from variants

@uamethod
def multiply(parent, x, y):
    print("multiply method call with parameters: ", x, y)
    return x * y


async def main():
    # optional: setup logging
    #logger = logging.getLogger("asyncua.address_space")
    # logger.setLevel(logging.DEBUG)
    #logger = logging.getLogger("asyncua.internal_server")
    # logger.setLevel(logging.DEBUG)
    #logger = logging.getLogger("asyncua.binary_server_asyncio")
    # logger.setLevel(logging.DEBUG)
    #logger = logging.getLogger("asyncua.uaprocessor")
    # logger.setLevel(logging.DEBUG)

    # now setup our server
    server = Server()
    await server.init()
    server.disable_clock()  #for debuging
    server.set_endpoint("opc.tcp://localhost:4840/freeopcua/server/")
    #server.set_endpoint("opc.tcp://0.0.0.0:4840/freeopcua/server/")
    server.set_server_name("FreeOpcUa Example Server")
    # set all possible endpoint policies for clients to connect through
    server.set_security_policy([
                ua.SecurityPolicyType.NoSecurity,
                ua.SecurityPolicyType.Basic256Sha256_SignAndEncrypt,
                ua.SecurityPolicyType.Basic256Sha256_Sign])

    # setup our own namespace
    uri = "http://examples.freeopcua.github.io"
    idx = await server.register_namespace(uri)

    # create a new node type we can instantiate in our address space
    dev = await server.nodes.base_object_type.add_object_type(idx, "MyDevice")
    await (await dev.add_variable(idx, "sensor1", 1.0)).set_modelling_rule(True)
    await (await dev.add_property(idx, "device_id", "0340")).set_modelling_rule(True)
    ctrl = await dev.add_object(idx, "controller")
    await ctrl.set_modelling_rule(True)
    await (await ctrl.add_property(idx, "state", "Idle")).set_modelling_rule(True)

    # populating our address space

    # First a folder to organise our nodes
    myfolder = await server.nodes.objects.add_folder(idx, "myEmptyFolder")
    # instanciate one instance of our device
    mydevice = await server.nodes.objects.add_object(idx, "Device0001", dev)
    mydevice_var = await mydevice.get_child([f"{idx}:controller", f"{idx}:state"])  # get proxy to our device state variable
    # create directly some objects and variables
    myobj = await server.nodes.objects.add_object(idx, "MyObject")
    myvar = await myobj.add_variable(idx, "MyVariable", 6.7)
    await myvar.set_writable()    # Set MyVariable to be writable by clients
    mystringvar = await myobj.add_variable(idx, "MyStringVariable", "Really nice string")
    await mystringvar.set_writable()    # Set MyVariable to be writable by clients
    mydtvar = await myobj.add_variable(idx, "MyDateTimeVar", datetime.utcnow())
    await mydtvar.set_writable()    # Set MyVariable to be writable by clients
    myarrayvar = await myobj.add_variable(idx, "myarrayvar", [6.7, 7.9])
    myuintvar = await myobj.add_variable(idx, "myuintvar", ua.UInt16(4))
    await myobj.add_variable(idx, "myStronglytTypedVariable", ua.Variant([], ua.VariantType.UInt32))
    await myarrayvar.set_writable(True)
    myprop = await myobj.add_property(idx, "myproperty", "I am a property")
    mymethod = await myobj.add_method(idx, "mymethod", func, [ua.VariantType.Int64], [ua.VariantType.Boolean])
    multiply_node = await myobj.add_method(idx, "multiply", multiply, [ua.VariantType.Int64, ua.VariantType.Int64], [ua.VariantType.Int64])

    # import some nodes from xml
    #await server.import_xml("custom_nodes.xml")

    # creating a default event object
    # The event object automatically will have members for all events properties
    # you probably want to create a custom event type, see other examples
    myevgen = await server.get_event_generator()
    myevgen.event.Severity = 300

    # starting!
    async with server:
        print("Available loggers are: ", logging.Logger.manager.loggerDict.keys())
        # enable following if you want to subscribe to nodes on server side
        #handler = SubHandler()
        #sub = await server.create_subscription(500, handler)
        #handle = await sub.subscribe_data_change(myvar)
        # trigger event, all subscribed clients wil receive it
        var = await myarrayvar.read_value()  # return a ref to value in db server side! not a copy!
        var = copy.copy(var)  # WARNING: we need to copy before writting again otherwise no data change event will be generated
        var.append(9.3)
        await myarrayvar.write_value(var)
        await mydevice_var.write_value("Running")
        await myevgen.trigger(message="This is BaseEvent")
        await server.write_attribute_value(myvar.nodeid, ua.DataValue(0.9))  # Server side write method which is a bit faster than using write_value
        while True:
            await asyncio.sleep(0.1)
            await server.write_attribute_value(myvar.nodeid, ua.DataValue(sin(time.time())))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
  
# import asyncio

# from asyncua import Client

# url = "opc.tcp://localhost:4840/freeopcua/server/"
    
# client = Client(url)
# client.connect()

# async def callMethod(dato):
#         sys = client.get_node("ns=2;i=1")
#         method = client.get_node("ns=2;i=3")
#         res = await sys.call_method(method, data)
#         return res

# comando = input("Comando: ")
# if comando == "M":
#         res = callMethod(1)
#         print(res)
# else:
#         print("nada")
# import serial
# # def getValues(trama, sep1, sep2):
# #     splited_trama = trama.split(sep1)
# #     arr_valores = []
# #     for dato in splited_trama:
# #         arr_temp = dato.split(sep2)
# #         print(arr_temp)
# #         arr_valores.append(arr_temp[1])

# #     return arr_valores

# # string1 = "ERR=0:EST=0:CTRL=0:ANG=30:FLEX=40:EXT=100:VEL=2:TIME=20:DEL=4:CH=12:CL=14"

# # arr_valores = getValues(string1, ":", "=")

# # print(arr_valores)

# # class Prueba:
# #     def __init__(self):
# #         self.nombre = ""
# #         self.apellido = ""

# # ensayo = Prueba()
# # print("Nombre: " + ensayo.nombre)
# # print("Apallido: " + ensayo.apellido)
# # ensayo.nombre = "Gaby"
# # ensayo.apellido = "López"
# # print("Nombre: " + ensayo.nombre)
# # print("Apallido: " + ensayo.apellido)

# # serial = serial.Serial("COM7", 9600)
       

# # while True:

# #         print("-----------------------------")
# #         print("INGRESE PARÁMETROS o 8 para salir")
# #         flexion = input("Flexión: ")
# #         if flexion == "8":
# #             serial.write(f"<S&0&0&0&0&0&0>".encode())
# #             print("saliendo...")
# #             break
# #         extension = input("Extensión: ")
# #         velocidad = input("Velocidad: ")
# #         tiempo = input("Tiempo: ")
# #         delay = input("Delay: ")
# #         play = input("Play: ")

# #         serial.write(f"<S&{flexion}&{extension}&{velocidad}&{tiempo}&{delay}&{play}>".encode())
# #         print("enviando ...")

# from asyncua import Client
# import time

# url = "opc.tcp://localhost:4840/freeopcua/server/"

# client = Client(url)

# client.connect()
# print("Client connected")

# while True:
#         led1_node = client.get_node("ns=2;i=1")
#         led1 = led1_node.get_value()
        
#         led2_node = client.get_node("ns=2;i=2")
#         led2 = led2_node.get_value()

#         light_rest_node = client.get_node("ns=2;i=7")
#         light = light_rest_node.get_value()

#         print(led1, led2, light)
#         time.sleep(1)


# from asyncua import Server, uamethod, ua
# from serial import Serial
# import asyncio
# import os
    

# # Create class to wrap serial read and write async
# class SafeSerial:
#     def __init__(self, url: str, baudrate: int):
#         self.url = url
#         self.baudrate = baudrate
#         self.serial = Serial(url, baudrate)
#         self.lock = asyncio.Lock()
#         self.status = True

#     async def reset(self):
#         self.serial = Serial(self.url, self.baudrate)
#         self.status = True

#     async def readline(self):
#         loop = asyncio.get_event_loop()
#         return await loop.run_in_executor(None, self.serial.readline)

#     async def write(self, data: str):
#         loop = asyncio.get_event_loop()
#         return await loop.run_in_executor(None, self.serial.write, data)



# #Método para obtener los valores de la trama
# def getValues(trama, sep1, sep2):
#     splited_trama = trama.split(sep1)
#     arr_valores = []
#     for dato in splited_trama:
#         arr_temp = dato.split(sep2)
#         arr_valores.append(arr_temp[1])

#     return arr_valores


# def create_set_led1(serial: SafeSerial):
#     @uamethod
#     async def set_led1(parent, state: bool):
#         loop = asyncio.get_event_loop()
#         async with serial.lock:
#             await serial.write(f"<S1&{int(state)}>".encode())
#             res = await serial.readline()
#             return not not int(res.decode()[0])

#     return set_led1

# def create_set_led2(serial: SafeSerial):
#     @uamethod
#     async def set_led2(parent, state: bool):
#         loop = asyncio.get_event_loop()
#         async with serial.lock:
#             await serial.write(f"<S2&{int(state)}>".encode())
#             res = await serial.readline()
#             return not not int(res.decode()[0])

#     return set_led2

# async def send_string(serial: SafeSerial, flexion, extension, velocidad, tiempo, delay, play):
#     loop = asyncio.get_event_loop()
#     async with serial.lock:
#         await serial.write(f"<S&{flexion}&{extension}&{velocidad}&{tiempo}&{delay}&{play}>".encode())
#         res = await serial.readline()
#         print(res.decode())

# async def main():
#     # Create serial connection
#     serial = SafeSerial(
#         os.environ.get("SERIAL") if os.environ.get("SERIAL") else "COM4",
#         os.environ.get("BAUD") if os.environ.get("BAUD") else 9600,
#     )
#     # Initialize OPC-UA Server
#     server = Server()
#     await server.init()
#     server.set_endpoint(
#         f"opc.tcp://localhost:{os.environ.get('PORT') if os.environ.get('PORT') else 4840}/freeopcua/server/"
#     )
#     # Instance method and state variable for LED
#     uri = "test:opcua"
#     idx = await server.register_namespace(uri)
    
#     led_state1 = await server.nodes.objects.add_variable(idx, "LEDState1", False)
#     led_state2 = await server.nodes.objects.add_variable(idx, "LEDState2", False)
#     led_state3 = await server.nodes.objects.add_variable(idx, "LEDState3", False)
#     led_state4 = await server.nodes.objects.add_variable(idx, "LEDState4", False)
#     led_state5 = await server.nodes.objects.add_variable(idx, "LEDState5", False)
#     led_state6 = await server.nodes.objects.add_variable(idx, "LEDState6", False)
#     light_state = await server.nodes.objects.add_variable(idx, "LIGHTState", 0)

#     await server.nodes.objects.add_method(
#         idx,
#         "SetLEDState1",
#         create_set_led1(serial),
#         [ua.VariantType.Boolean],
#         [ua.VariantType.Boolean],
#     )
#     await server.nodes.objects.add_method(
#         idx,
#         "SetLEDState2",
#         create_set_led2(serial),
#         [ua.VariantType.Boolean],
#         [ua.VariantType.Boolean],
#     )
    

#     # Initialize OPC-UA server
#     async with server:
#         await asyncio.sleep(0.1)
#         # Pool for LED state
#         while True:
#             await asyncio.sleep(0.5)
#             try:
#                 status: bool = None
#                 async with serial.lock:
#                     await serial.write(b"<G>")
#                     res = await serial.readline()
#                     trama = str(res.decode()).strip()
#                     arr_vals = getValues(trama, ":", "=")
#                     status1 = not not int(arr_vals[0])
#                     status2 = not not int(arr_vals[1])
#                     status3 = not not int(arr_vals[2])
#                     status4 = not not int(arr_vals[3])
#                     status5 = not not int(arr_vals[4])
#                     status6 = not not int(arr_vals[5])
#                     light_status = int(arr_vals[6])
                    
#                 await led_state1.set_value(status1, ua.VariantType.Boolean)
#                 await led_state2.set_value(status2, ua.VariantType.Boolean)
#                 await led_state3.set_value(status3, ua.VariantType.Boolean)
#                 await led_state4.set_value(status4, ua.VariantType.Boolean)
#                 await led_state5.set_value(status5, ua.VariantType.Boolean)
#                 await led_state6.set_value(status6, ua.VariantType.Boolean)
#                 await light_state.set_value(light_status, ua.VariantType.Int64)
#             except Exception as e:
#                 print(e)
    
    


# if __name__ == "__main__":
#     asyncio.run(main())