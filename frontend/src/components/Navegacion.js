import { Box, Button } from '@mui/material'
import React from 'react'




export const Navegacion = () => {
let pages = ['Pacientes', 'Monitoreo'];
  
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
            key='Inicio'
            sx={{ my: 2, color: 'white', display: 'block' }}
            href={'/'}
          >
            Inicio
          </Button>
        {pages.map((page) => (
          <Button
            key={page}
            sx={{ my: 2, color: 'white', display: 'block' }}
            href={`/${page}`}
          >
            {page}
          </Button>
        ))}
      </Box>
    )
}
