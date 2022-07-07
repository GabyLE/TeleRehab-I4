import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Parametros } from '../components/dashboardmd/parametros';
import { Control } from '../components/dashboardmd/control';
import { Estado } from '../components/dashboardmd/estado';
import Stack from '@mui/material/Stack';
import CircleIcon from '@mui/icons-material/Circle';
import Button from '@mui/material/Button';
import { Observacion } from '../components/dashboardmd/observacion';
import { obtenerIdSesion, obtenerPaciente } from '../utils/Global';
const API = process.env.REACT_APP_API;


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const DashboardMD = () => {

  const [paciente, setPaciente] = useState(obtenerPaciente);
  const [idSesion, setIdSesion] = useState(obtenerIdSesion);

  const terminar = async () => {
    const res = await fetch(`${API}/params/terminar/${idSesion.objId}`);
    const data = await res.json();
    window.alert(data.respuestaServidor)
}

  return (
    <Box component="span" sx={{ p: 2, flexGrow: 1 }}>
      <h5><b>Paciente:</b> {paciente.nombre}</h5>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <Parametros />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={2} justifyContent="center">
          <Control />
            <Estado />
            <Button variant="contained" color="error" onClick={terminar}>
              Parada Emergencia
              <CircleIcon sx={{ fontSize: 50 }} />
            </Button>
          </Stack>
        </Grid>
        <Grid item xs>
          <Item>
            <Observacion />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
