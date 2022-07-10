import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';


const obtenerEstilos = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100vh',
        position: 'relative'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
}));

const Inicio = () => {
    const estilos = obtenerEstilos();
    const imagePath = `/assets/img/fondo.jpg`;
    const imagePathLogo = `/assets/img/logo2.jpeg`;

    return (
        <section className={estilos.root}>
            
            <img src={imagePath} alt='Fondo' width="100%" height="100%" />
            <div className={estilos.overlay}>
                <Box
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    color="#fff"
                >
                    <img src={imagePathLogo} alt='logo' width="50%" height="50%" />
                    <Typography variant="h3" component="h1" sx={{ pb:4 }}>
                        TeleRehab I4
                    </Typography>
                    <h6><i>Moviendo corazones desde la distancia</i></h6>
                </Box>
            </div>
        </section>
    );
};

export default Inicio;