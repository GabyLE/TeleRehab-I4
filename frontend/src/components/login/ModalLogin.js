import Dialog from '@material-ui/core/Dialog';
import Formulario from './Formulario';

const ModalLogin = ({ open, cerrar }) => {

    return (
        <Dialog open={open} onClose={cerrar}>
            <Formulario cerrarFormulario={cerrar} />
        </Dialog>

    );

}

export default ModalLogin;