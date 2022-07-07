import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { getCurrentDate, obtenerIdSesion, obtenerUsuarioLogueado } from '../utils/Global';

import { useNavigate } from "react-router"
const API = process.env.REACT_APP_API;


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const Monitoreo = () => {

    
    const [tecnico, setTecnico] = useState(obtenerUsuarioLogueado);
    let navigate = useNavigate();

    // const terminar = async () => {
    //     const res = await fetch(`${API}/params/terminar/${idSesion.objId}`);
    //     const data = await res.json();
    //     window.alert(data.respuestaServidor)
    // }

    const enviarSesion = (e) => {
        fetch(`${API}/sesion/tc`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Sesion: {
                    Fecha: getCurrentDate('-'),
                    IdTecnico: tecnico.numDoc
                }
            })
        }).then((res) => res.json())
        .then((json) => {
            //console.log(json.objId)
            if (json == "Error servidor"){
                window.alert(json)
            } else{
            if (json.objId){
                const strIdSesion = JSON.stringify(json);
                sessionStorage.setItem('idSesion', strIdSesion)
                
            } else {
                sessionStorage.removeItem('idSesion')
            }}
        })
    }

    const nuevaSesion = () => {
        
        
    
            enviarSesion()
            
            navigate(`/sesion/tc`);

    }

    return (
        <Box component="span" sx={{ p: 2, flexGrow: 1 }}>
            <h5><b>Monitoreo</b></h5>
            <Button variant="contained" color="secondary" sx={{ m: 0.5 }} onClick={nuevaSesion}>
                Nueva Sesion
            </Button>
            
        </Box>
    );
}