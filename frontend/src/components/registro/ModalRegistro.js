import Dialog from '@material-ui/core/Dialog';
import Formulario from './Formulario';

const ModalRegistro = ({ open, cerrar }) => {

    return (
        <Dialog open={open} onClose={cerrar}>
            <Formulario cerrarFormulario={cerrar} />
        </Dialog>

    );

}

export default ModalRegistro;