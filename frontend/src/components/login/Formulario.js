import { Button } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
const API = process.env.REACT_APP_API;



const obtenerEstilos = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),

        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '300px',
        },
        '& .MuiButtonBase-root': {
            margin: theme.spacing(2),
        },
    },
}));

const Formulario = ({ cerrarFormulario }) => {
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');

    const enviarFormulario = (e) => {
        //Consumir la API para validar las credenciales
        fetch(`${API}/login`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Login: {
                    Email: email,
                    Clave: clave
                }
            })
        }).then((res) => res.json())
            .then((json) => {
                //window.alert(json.Nombre);
                const usuarioLogueado = {
                    id: json.Id,
                    email: json.Email,
                    nombre: json.Nombre,
                    numDoc: json.NumDoc,
                    tipo: json.Tipo
                }
                if (usuarioLogueado.nombre) {
                    //almacenar los datos del usuario para el resto de la aplicacion
                    const strUsuarioLogueado = JSON.stringify(usuarioLogueado);
                    sessionStorage.setItem("usuarioLogueado", strUsuarioLogueado);

                }
                else {
                    window.alert("Las credenciales no son válidas");
                    sessionStorage.removeItem("usuarioLogueado");
                }
                cerrarFormulario();
            })

    }

    const estilos = obtenerEstilos();



    return (
        <form className={estilos.root} onSubmit={enviarFormulario}>
            <h6>Iniciar Sesión</h6>
            <TextField
                label="Email"
                variante="filled"
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                label="Clave"
                variante="filled"
                required 
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
            />
            <div>
            <Button onClick={cerrarFormulario}>
                    Cerrar
                </Button>
            <Button onClick={enviarFormulario} color="primary">
                    Ingresar
                </Button>
            </div>

        </form>
    )
}


export default Formulario;