import React from 'react';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { obtenerIdSesion } from '../../utils/Global';
const API = process.env.REACT_APP_API;



export const Observacion = () => {

    const [idSesion, setIdSesion] = useState(obtenerIdSesion);
    const [observacion, setObservacion] = useState('')

    const enviarObservacion = (e) => {
        console.log("Entre")
        fetch(`${API}/observacion`,{
          
            method: 'POST',
            headers: {
                
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
               Obs: {
                    ObjId: idSesion.objId,
                    Observacion: observacion
                }}
            )
        })
        .then((res) => res.json())
        .then((json) => {
                window.alert(`Respuesta: ${json}`);
        })
        .catch(function (error) {
               window.alert(`error agregando observacion [${error}]`);
        });
    }

    return (
        <>

            <h5>Observacion</h5>
            <TextField
                label="Observación"
                multiline
                fullWidth
                rows={4}
                value={observacion}
                onChange={(e) => { setObservacion(e.target.value) }}
            />
            <div>
                <Button variant="contained" color="primary" onClick={enviarObservacion}>
                    Guardar
                </Button>
            </div>

        </>

    )
}
