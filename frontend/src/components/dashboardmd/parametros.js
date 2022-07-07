import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import { obtenerIdSesion } from '../../utils/Global';

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

export const Parametros = () => {

    const estilos = obtenerEstilos();

    const [idSesion, setIdSesion] = useState(obtenerIdSesion);
    const [flexion, setFlexion] = useState("");
    const [extension, setExtension] = useState("");
    const [sostenimiento, setSostenimiento] = useState("");
    const [velocidad, setVelocidad] = useState("");
    const [tiempo, setTiempo] = useState("");
    console.log(idSesion.objId)

    const actualizar = (e) => {
        console.log("Entre")
        fetch(`${API}/params`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                params: {
                    flexion: flexion,
                    extension: extension,
                    tiempoSesion: tiempo,
                    velocidad: velocidad,
                    tiempoSost: sostenimiento,
                    play: 0,
                    _id: idSesion.objId
                }
            })
        })
        .then((res) => res.json())
        .then((json) => {
                window.alert(`Respuesta: ${json}`);
        })
        .catch(function (error) {
               window.alert(`error agregando parámetros [${error}]`);
        });
    }



    return (
        <div className={estilos.root}>
            <h3>Parámetros </h3>
            <TextField
                label="Ángulo de Flexión"
                required
                value={flexion}
                onChange={(e) => { setFlexion(e.target.value) }}
            />
            <TextField
                label="Ángulo de Extensión"
                required
                value={extension}
                onChange={(e) => { setExtension(e.target.value) }}
            />
            <TextField
                label="Tiempo Sostenimiento"
                required
                value={sostenimiento}
                onChange={(e) => { setSostenimiento(e.target.value) }}
            />
            <TextField
                label="Velocidad"
                required
                value={velocidad}
                onChange={(e) => { setVelocidad(e.target.value) }}
            />
            <TextField
                label="Tiempo de Sesión"
                required
                value={tiempo}
                onChange={(e) => { setTiempo(e.target.value) }}
            />
            <div>
                <Button variant="contained" color="primary" onClick={actualizar}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}