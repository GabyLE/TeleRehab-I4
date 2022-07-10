import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { obtenerIdSesion } from '../../utils/Global';
import CircleIcon from '@mui/icons-material/Circle';
import { elementAcceptingRef } from '@mui/utils';
import Mensaje from '../Mensaje';

const API = process.env.REACT_APP_API;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Estado = () => {

  const [idSesion, setIdSesion] = useState(obtenerIdSesion);
  const [motor, setMotor] = useState('inherit');
  const [alineacion, setAlineacion] = useState('inherit');

  const [openMotor, setOpenMotor] = useState(false);
    const handleOpenM = () => setOpenMotor(true);
    const handleCloseM = () => setOpenMotor(false);

    const [openAlineacion, setOpenAlineacion] = useState(false);
    const handleOpenA = () => setOpenAlineacion(true);
    const handleCloseA = () => setOpenAlineacion(false);


  const setEstados = async () => {
    
    const res = await fetch(`${API}/sensores/estados/${idSesion.objId}`);
    const data = await res.json();
    
    data.map((item) => {
        if(item.motor == 1){
          setMotor('success');
          handleCloseM();
          console.log('successM');
        }
        else if (item.motor == 2) {
          setMotor('error');
          handleOpenM();
          console.log('errorM')
        }

        if(item.alineacion == 1){
          setAlineacion('success');
          handleCloseA();
          console.log('successA');
        }
        else if (item.alineacion == 2) {
          setAlineacion('error');
          handleOpenA();
          console.log('errorA')
        }
    });
  }

  useEffect(() => {
    const interval = setInterval(() => setEstados(), 20000);
    return () => {
        clearInterval(interval);
    };
}, []);


  return (
    <Box sx={{ flexGrow: 1 }}>
       <h5>Estado</h5> 
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            Motor
            <CircleIcon color={motor}/>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            Alineación
            <CircleIcon color={alineacion}/>
          </Item>
        </Grid>
      </Grid>

      <Mensaje
                    open={openAlineacion}
                    titulo="Error en la Alineación"
                    mensaje="Sesión pausada"
                    cerrar={handleCloseA}
                />

<Mensaje
                    open={openMotor}
                    titulo="Error en el Motor"
                    mensaje="Sesión pausada"
                    cerrar={handleCloseM}
                />
    </Box>
  );
}

