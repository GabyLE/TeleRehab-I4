import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { obtenerPaciente } from '../../utils/Global';

const API = process.env.REACT_APP_API;



export const Observaciones = () => {

  const [observaciones, setObservaciones] = useState([]);
  const [paciente, setPaciente] = useState(obtenerPaciente);

  const getObservaciones = async () => {
    const res = await fetch(`${API}/observacion/${paciente.id}`);
    const data = await res.json();
    setObservaciones(data)
  }

  useEffect(() => {
    getObservaciones();
  }, [])

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Fecha</TableCell>
          <TableCell align="right">Observación</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {observaciones.map((row) => (
          <TableRow
            key={row.fecha}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.fecha}
            </TableCell>
            <TableCell align="right">{row.observacion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}