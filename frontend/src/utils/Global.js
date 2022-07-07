import { createTheme} from '@mui/material/styles';

export const obtenerIdSesion = () => {
    // obtener los datos del usuario que está logueado
    const strIdSesion = sessionStorage.getItem("idSesion");
    return JSON.parse(strIdSesion);
}

export const obtenerUsuarioLogueado = () => {
    // obtener los datos del usuario que está logueado
    const strUsuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    return JSON.parse(strUsuarioLogueado);
}

export const obtenerPaciente = () => {
    // obtener los datos del usuario que está logueado
    const strPaciente = sessionStorage.getItem("paciente");
    return JSON.parse(strPaciente);
}

export const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#00BCD4',
        },
        secondary: {
            main: '#512DA8',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

export function getCurrentDate(separator=''){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }