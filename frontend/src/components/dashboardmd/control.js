import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Button from '@mui/material/Button';
import { obtenerIdSesion} from '../../utils/Global';
const API = process.env.REACT_APP_API;


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const Control = () => {

    const [idSesion, setIdSesion] = useState(obtenerIdSesion);
    const [tiempo, setTiempo] = useState(0);
    const [angulo, setAngulo] = useState(0);
    const [velocidad, setVelocidad] = useState(0)
    

    const setSensores = async () => {
        console.log(idSesion)
        const res = await fetch(`${API}/sensores/actualizar/${idSesion.objId}`);
        const data = await res.json();
        data.map((item) => {
            setAngulo(item.angulo);
            setTiempo(item.tiempoActual);
        });
      }

    useEffect(() => {
        const interval = setInterval(() => setSensores(), 20000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    const iniciar = async () => {
        const res = await fetch(`${API}/params/iniciar/${idSesion.objId}`);
        const data = await res.json();
        window.alert(data.respuestaServidor)
    }

    const pausar = async () => {
        const res = await fetch(`${API}/params/pausar/${idSesion.objId}`);
        const data = await res.json();
        window.alert(data.respuestaServidor)
    }

    const terminar = async () => {
        const res = await fetch(`${API}/params/terminar/${idSesion.objId}`);
        const data = await res.json();
        window.alert(data.respuestaServidor)
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <h5>En sesión</h5>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Item>

                        <Stack direction="row" spacing={2} alignItems='center' justifyContent='center'>

                            <Button variant="outlined" color="primary" size="large" onClick={iniciar}>
                                Iniciar
                                <PlayArrowIcon sx={{ fontSize: 30 }} />
                            </Button>
                            <Button variant="outlined" color="secondary" size="large" onClick={pausar}>
                                Pausar
                                <PauseIcon sx={{ fontSize: 30 }} />
                            </Button>
                            <Button variant="outlined" color="error" size="large" onClick={terminar}>
                                Terminar
                                <StopIcon sx={{ fontSize: 30 }} />
                            </Button>
                        </Stack>
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                        Tiempo<br />
                        <h3>{tiempo}</h3>
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                        Ángulo<br />
                        <h3>{angulo}</h3>
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                        Velocidad<br />
                        <h3>{velocidad}</h3>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}
