import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Navegacion } from './Navegacion';
import { obtenerUsuarioLogueado } from '../utils/Global';
import ModalLogin from './login/ModalLogin';
import ModalRegistro from './registro/ModalRegistro';

export default function MenuAppBar() {

    // Manejo del estado de usuario
    const [usuarioLogueado, setUsuarioLogueado] = useState(obtenerUsuarioLogueado)
    // Manejo del estado de la ventana modal
    const [estadoModalLogin, setEstadoModalLogin] = useState(false)
    // Manejo del estado de la ventana modal
    const [estadoModalRegistro, setEstadoModalRegistro] = useState(false);
    const imagePath = `/assets/img/logo.png`;

    // rutina que abre la ventana modal
    const abrirModalLogin = () => {
        setEstadoModalLogin(true);
    }

    // rutina que cierra la ventana modal
    const cerrarModalLogin = () => {
        setEstadoModalLogin(false);
        setUsuarioLogueado(obtenerUsuarioLogueado);
    }

    // rutina que abre la ventana modal
    const abrirModalRegistro = () => {
        setEstadoModalRegistro(true);
    }

    // rutina que cierra la ventana modal
    const cerrarModalRegistro = () => {
        setEstadoModalRegistro(false);
        setUsuarioLogueado(obtenerUsuarioLogueado);
    }

    // rutina que realiza la salida del usuario
    const salir = () => {
        sessionStorage.removeItem('usuarioLogueado');
        sessionStorage.removeItem('paciente');
        sessionStorage.removeItem('idSesion');
        setUsuarioLogueado(obtenerUsuarioLogueado);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <img src={imagePath} alt='Fondo' width="12%" height="12%"/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, m: 1 }}>
                        TeleRehab I4
                    </Typography>
                    
                    <span sx={{ m: 0.5 }}>
                        <h6>{usuarioLogueado ? usuarioLogueado.nombre : ""}</h6>
                    </span>
                    {usuarioLogueado ? (
                        <Button variant="contained" onClick={salir} sx={{ m: 2 }} href={"/"} >
                            Salir
                        </Button>
                    ) 
                        :
                        (<><Button variant="contained" onClick={abrirModalLogin} sx={{ m: 0.5 }}>
                            Iniciar Sesión
                        </Button>
                            <Button variant="contained" onClick={abrirModalRegistro} sx={{ m: 0.5 }}>
                                Registrarse
                            </Button>
                        </>
                        )}
                </Toolbar>
            </AppBar>
            <ModalLogin open={estadoModalLogin} cerrar={cerrarModalLogin} />
            <ModalRegistro open={estadoModalRegistro} cerrar={cerrarModalRegistro} />
            
            {usuarioLogueado && (
                <AppBar position="static">
                    <Navegacion />
                </AppBar>)}


        </Box>
    );
}