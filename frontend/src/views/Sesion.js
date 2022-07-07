import React from 'react'
import { PacienteForm } from '../components/sesion/paciente-form';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import { Observaciones } from '../components/sesion/observaciones';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    justifyContent: 'left',
    alignContent: 'center',
    alignItems: 'center'
}));


const Sesion = () => {
    return (
        <Box component="span" sx={{ p: 2, flexGrow: 1 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                    <Item>
                        <PacienteForm />
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    
                        
                        <Button variant="contained" color="secondary" href={`/play`}>
                            Nueva Sesion
                            <PlayArrowIcon sx={{ fontSize: 50 }} />
                        </Button>
                    
                </Grid>
                <Grid item xs>
                
                    <Item>
                        <Observaciones />
                    </Item>
                </Grid>
            </Grid>
        </Box>
    )
};

export default Sesion;



