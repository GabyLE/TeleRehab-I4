import React from 'react'
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

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

const tipos = [
    { label: 'Cédula de Ciudadanía', value: 0 },
    { label: 'Tarjeta de Identidad', value: 1 }
];

export const PacienteForm = () => {

    const estilos = obtenerEstilos();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [edad, setEdad] = useState("");
    const [tipo, setTipo] = useState("");
    const [id, setId] = useState("");
    const [residencia, setResidencia] = useState("");
    const [sesion, setSesion] = useState("");


    const guardar = (e) => {
        fetch(`${API}/sesion`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sesion:{
                    fecha: "21-05-2022",
                    nombresPaciente: nombre,
                    apellidosPaciente: apellido,
                    idPaciente: id,
                    correoPaciente: correo,
                    edad: edad,
                    residencia: residencia,
                    nombresMedico: "Cristhian Camilo",
                    apellidosMedico: "Candelo Peña",
                    idMedico: "1321698935",
                    correoMedico: "cristhian@gmail.com"
                }
            })
        })
        .then((res) => res.json())
        .then((json) => {
                console.log(`Respuesta: ${json}`);
                const strIdSesion = JSON.stringify(json);
                sessionStorage.setItem("idSesion", strIdSesion);
        })
        .catch(function (error) {
               window.alert(`error agregando paciente [${error}]`);
        });
    }

    return (
        
            <form className={estilos.root}  >
                <h3>Paciente</h3>
                <TextField
                    label="Nombre"
                    variant="filled"
                    required
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value) }}
                />

                <TextField
                    label="Apellido"
                    variant="filled"
                    required
                    value={apellido}
                    onChange={(e) => { setApellido(e.target.value) }}
                />

                <TextField
                    label="Correo electrónico"
                    variant="filled"
                    required
                    value={correo}
                    onChange={(e) => { setCorreo(e.target.value) }}
                />

                <TextField
                    label="Edad"
                    variant="filled"
                    required
                    value={edad}
                    onChange={(e) => { setEdad(e.target.value) }}
                />


                <TextField

                    select
                    label="Tipo de documento"
                    value={tipo}
                    onChange={(e) => { setTipo(e.target.value) }}
                    variant="standard"
                    sx={{ ml: 1, flex: 1, width: 200 }}
                >
                    {tipos.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Número de documento"
                    variant="filled"
                    required
                    value={id}
                    onChange={(e) => { setId(e.target.value) }}
                />

                <TextField
                    label="Luegar de residencia"
                    variant="filled"
                    required
                    value={residencia}
                    onChange={(e) => { setResidencia(e.target.value) }}
                />

                <div>
                    <Button variant="contained" onClick={guardar} color="primary">
                        Guardar
                    </Button>
                </div>
            </form>
       
    )
}
