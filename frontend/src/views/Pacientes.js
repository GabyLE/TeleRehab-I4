import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
//import ModalEditar from '../components/EditarVenta/Modal';
//import Confirmacion from '../components/Confirmacion';
import { ThemeProvider } from '@mui/material/styles';
// import ToolbarCRUD from '../components/ToolbarCRUD';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router"
import Button from '@mui/material/Button';
// ICONOS
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getCurrentDate, obtenerUsuarioLogueado, theme } from '../utils/Global';
// Globals
const API = process.env.REACT_APP_API;


const columnas = [
    { field: "tipoDocumento", headerName: "Tipo de Documento", width: 250 },
    { field: "id", headerName: "Número de Documento", width: 250 },
    { field: "nombre", headerName: "Nombre Completo", width: 135 },
    { field: "edad", headerName: "Edad", width: 180 },
    { field: "residencia", headerName: "Residencia", width: 130 },
    { field: "email", headerName: "Email", width: 160 },
]


const Pacientes = () => {

    const [pacientes, setPacientes] = useState([]);
    const [medico, setMedico] = useState(obtenerUsuarioLogueado);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState();
    let navigate = useNavigate();
    

    const listarPacientes = async () => {
        // Consultar la lista de usuarios desde la API
        const res = await fetch(`${API}/pacientes`);
        const data = await res.json();
        setPacientes(data)
    }

    const enviarSesion = (e) => {
        fetch(`${API}/sesion/md`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Sesion: {
                    Fecha: getCurrentDate('-'),
                    IdMedico: medico.numDoc,
                    IdPaciente: pacienteSeleccionado.id
                }
            })
        }).then((res) => res.json())
        .then((json) => {
            //console.log(json.objId)
            if (json == "Error servidor"){
                window.alert(json)
            } else{
            if (json.objId){
                const strIdSesion = JSON.stringify(json);
                sessionStorage.setItem('idSesion', strIdSesion)
                
            } else {
                sessionStorage.removeItem('idSesion')
            }}
        })
    }


    const nuevaSesion = () => {
        
        if (pacienteSeleccionado) {
            
            let strPacienteSeleccionado = JSON.stringify(pacienteSeleccionado)
            sessionStorage.setItem('paciente', strPacienteSeleccionado);
            
            
            enviarSesion()
            
            navigate(`/sesion`);

        } else {
            sessionStorage.removeItem('paciente');
            window.alert("Por favor seleccione un paciente");
        }
    }

    useEffect(() => {
        listarPacientes();
    }, [])

    
    


    return (
        <div>
            <center>
                <h1>
                    Pacientes
                </h1>
            </center>
            <ThemeProvider theme={theme}>
                <div style={{ height: 500, width: '100%' }}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                        spacing={1}
                    >
                        <Button variant="outlined" startIcon={<AddCircleIcon />} sx={{ m: 0.5 }}  >
                            Agregar
                        </Button>

                        <Button variant="contained" color="secondary" sx={{ m: 0.5 }} onClick={nuevaSesion}>
                            Nueva Sesion
                        </Button>

                    </Paper>
                    <DataGrid
                        rows={pacientes}
                        columns={columnas}
                        pageSize={7}
                        rowsPerPageOptions={[7]}
                        sx={{ m: 2 }}
                        onSelectionModelChange={(ids)=> {
                            let item = pacientes.find( fila => fila.id === ids[0]);
                            setPacienteSeleccionado(item);
                        }}
                    />

                </div>
            </ThemeProvider>
        </div>
    )
}

export default Pacientes;