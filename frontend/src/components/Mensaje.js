import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
    borderRadius: 4,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const Mensaje = ({open, titulo, mensaje, cerrar}) => {

    return (
        <Modal
        open={open}
        onClose={cerrar}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {titulo}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {mensaje}
            </Typography>
        </Box>
    </Modal>
    )

}

export default Mensaje;