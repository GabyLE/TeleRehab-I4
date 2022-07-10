from asyncua import Client

async def set_let():
    res = ''
    url = "opc.tcp://localhost:4840/freeopcua/server/"
    try:
        async with Client(url=url) as client:
            uri = "telerehab:opcua"
            idx = await client.get_namespace_index(uri)
            test = await client.nodes.root.get_child(["0:Objects", "2:Test"])
            res = await test.call_method("2:SetLEDState", True)
            
    except Exception as e:
        res = "Error servidor"
    return res

async def set_params(flex, ext, vel, time, sost, play):
    res = ''
    url = "opc.tcp://localhost:4840/freeopcua/server/"
    try:
        async with Client(url=url) as client:
            uri = "telerehab:opcua"
            idx = await client.get_namespace_index(uri)
            test = await client.nodes.root.get_child(["0:Objects", "2:Parametros"])
            resServ = await test.call_method("2:SendParams", flex, ext, vel, time, sost, play)
            if resServ:
                res = {'mensaje': 'OK'}
    except Exception as e:
        res = {'mensaje': 'Error servidor', 'error': e}
    return res

async def send_id(idSesion):
    res = ''
    url = "opc.tcp://localhost:4840/freeopcua/server/"
    try:
        async with Client(url=url) as client:
            uri = "telerehab:opcua"
            idx = await client.get_namespace_index(uri)
            test = await client.nodes.root.get_child(["0:Objects", "2:Parametros"])
            resServ = await test.call_method("2:GetIdSesion", idSesion)
        if resServ:
                res = {'mensaje': 'OK'}
    except Exception as e:
        res = {'mensaje': 'Error servidor', 'error': e}
    return res