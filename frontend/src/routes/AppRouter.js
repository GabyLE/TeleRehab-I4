import { Routes, Route, BrowserRouter } from "react-router-dom"
import Inicio from "../views/Inicio"
import { DashboardMD } from "../views/DashboardMD"
import Pacientes from "../views/Pacientes"
import { Monitoreo } from "../views/Monitoreo"
import { DashboardTC } from "../views/DashboardTC"

export const AppRouter = () => {
    return(
        <BrowserRouter>
            <Routes>
                
                <Route path="/pacientes" element={ <Pacientes/> } />
                <Route path="/monitoreo" element={ <Monitoreo/> } />
                <Route path = "/sesion" element={ <DashboardMD />} />
                <Route path='/sesion/tc' element={ <DashboardTC />} />
                <Route path = "/" element={ <Inicio />} />
            </Routes>
        </BrowserRouter>
    )
}