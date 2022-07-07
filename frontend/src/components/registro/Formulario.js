import { Button } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@mui/material/MenuItem';
const API = process.env.REACT_APP_API;



const obtenerEstilos = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),

        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '300px',
        },
        '& .MuiButtonBase-root': {
            margin: theme.spacing(2),
        },
    },
}));

const tiposDoc = [
    { label: 'Cédula de Ciudadanía', value: 'Cédula de Ciudadanía' },
    { label: 'Tarjeta de Identidad', value: 'Tarjeta de Identidad' }
];

const tiposUser = [
    { label: 'Médico', value: 'Médico' },
    { label: 'Ingeniero', value: 'Ingeniero' }
];

const Formulario = ({ cerrarFormulario }) => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [tipoDoc, setTipoDoc] = useState('');
    const [numDoc, setNumDoc] = useState('');
    const [tipo, setTipo] = useState('');
    const [clave1, setClave1] = useState('');
    const [clave2, setClave2] = useState('');

    const enviarFormulario = (e) => {
        //Consumir la API para validar las credenciales
        fetch(`${API}/registro`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Registro: {
                    Nombre: nombre,
                    Email: email,
                    TipoDoc: tipoDoc,
                    NumDoc: numDoc,
                    Tipo: tipo,
                    Clave1: clave1,
                    Clave2: clave2
                }
            })
        }).then((res) => res.json())
            .then((json) => {
                //window.alert(json.Nombre);
                const usuarioLogueado = {
                    id: json.Id,
                    email: json.Email,
                    nombre: json.Nombre,
                    numDoc: json.NumDoc,
                    tipo: json.Tipo
                }
                if (usuarioLogueado.nombre) {
                    //almacenar los datos del usuario para el resto de la aplicacion
                    const strUsuarioLogueado = JSON.stringify(usuarioLogueado);
                    sessionStorage.setItem("usuarioLogueado", strUsuarioLogueado);

                }
                else {
                    window.alert("Las credenciales no son válidas");
                    sessionStorage.removeItem("usuarioLogueado");
                }
                cerrarFormulario();
            })

    }

    const estilos = obtenerEstilos();



    return (
        <form className={estilos.root} onSubmit={enviarFormulario}>
            <h6>Registro</h6>
            <TextField
                label="Nombre Completo"
                variante="filled"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
                label="Email"
                variante="filled"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField

                select
                label="Tipo de documento"
                value={tipoDoc}
                onChange={(e) => { setTipoDoc(e.target.value) }}
                variant="standard"
                sx={{ ml: 1, flex: 1, width: 200 }}
            >
                {tiposDoc.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Número de Documento"
                variante="filled"
                required
                value={numDoc}
                onChange={(e) => setNumDoc(e.target.value)}
            />
            <TextField

                select
                label="Tipo de Usuario"
                value={tipo}
                onChange={(e) => { setTipo(e.target.value) }}
                variant="standard"
                sx={{ ml: 1, flex: 1, width: 200 }}
            >
                {tiposUser.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Clave1"
                variante="filled"
                required
                type="password"
                value={clave1}
                onChange={(e) => setClave1(e.target.value)}
            />
            <TextField
                label="Clave2"
                variante="filled"
                required
                type="password"
                value={clave2}
                onChange={(e) => setClave2(e.target.value)}
            />
            <div>
                <Button onClick={cerrarFormulario}>
                    Cerrar
                </Button>
                <Button onClick={enviarFormulario} color="primary">
                    Registrar
                </Button>
            </div>

        </form>
    )
}


export default Formulario;