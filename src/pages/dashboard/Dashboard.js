import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import {Routes, Route, Navigate} from "react-router-dom"

import Loader from "../../components/Loader/Loader"

import DashboardLayout from '../../layouts/dashboard';

import {useSelector, useDispatch} from "react-redux"
import { set_appointment_types, set_civil_status_types_list, set_memberships, set_menu, set_patient_types, set_phone_types_list, set_role } from '../../store/dashboard/actions';

import Home from './content/Home';
import InConstruction from '../shared/InConstruction';
import Page404 from '../shared/Page404';
import RestorePassword from './content/usuarios-y-permisos/RestorePassword';
import Security from './content/configuraciones/Security';
import Permissions from './content/usuarios-y-permisos/Permissions';
import CreateAccount from './content/usuarios-y-permisos/CreateAccount';
import FichaPersonal from './content/rrhh/FichaPersonal';
import InformeMedico from './content/citas/InformeMedico';
import Asignacion from './content/inventario/Asignacion';
import Inventario from './content/inventario/Inventario';
import AdministrarCita from './content/citas/Administrar';
import TokenExpired from '../shared/TokenExpired';
import VerifyEmail from '../shared/verifyEmail';
import Perfil from './content/configuraciones/Perfil';
import Agenda from './content/citas/Agenda';
import PatientHistory from './content/citas/PatientHistory';
import Membership from './content/usuarios-y-permisos/Membership';
import Bills from './content/finanzas/Recibos';
import Cargos from './content/rrhh/Cargos';
import AccountGroups from './content/usuarios-y-permisos/AccountGroups';
import CurrencyExchange from './content/finanzas/CurrencyExchange';
import Appointment from './content/reports/Appointment';
import Inventory from './content/reports/Inventory';
import Rrhh from './content/reports/Rrhh';

import Contracts from './content/tiendas/Contracts';
import AdmTiendas from './content/tiendas/AdmTiendas';
import Administracion from './content/inventario/Administracion';

function PrivateRoute({ children }) {
    // const auth = useAuth();
    let isAuth = true;
    return isAuth ? children : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
    children: PropTypes.object.isRequired
};

function Dashboard() {
    const [loaded, setloaded]   = useState(false);
    const [loading, setloading] = useState(true);

    const [searchData, setsearchData] = useState(true);

    const dashboard = useSelector(state => state.dashboard);
    const session   = useSelector(state => state.session);

    const dispatch = useDispatch();

    async function getRole(){
        let localRole   = localStorage.getItem("role");
        let role        = "";

        if(localRole){
            role = JSON.parse(localRole);
        }else{
            role = session.userData.data.role[0];
        }

        // role = session.userData.data.role[0];
        // console.log("Role:"+role);

        await dispatch(set_role(role));
        return role;
    }

    async function getData(){
        let role = await getRole();
        // console.log(role);

        await dispatch(set_menu(role.id));
        await dispatch(set_phone_types_list());
        await dispatch(set_civil_status_types_list());
        await dispatch(set_patient_types());
        await dispatch(set_appointment_types());
        await dispatch(set_memberships());

        setloaded(true);
    }

    useEffect(() => {
        if(loading){
            if(!loaded){
                if(searchData){
                    setsearchData(false);
                    // console.log(session.userData.data.role[0].id);
                    getData();
                }
            }else if(
                    dashboard.menu !== null && 
                    dashboard.appointmentTypes !== null && 
                    dashboard.civilStatusTypes !== null && 
                    dashboard.phoneTypesList !== null && 
                    dashboard.patientTypes !== null &&
                    dashboard.memberships !== null
                ){
                // console.log(dashboard);
                setloading(false);
            }
        }
    });
    
    if(loading){
        return <Loader isFullPage />
    }

    return (
        <Routes>

            <Route path="/dashboard" element={<DashboardLayout />} >
                {/* dashboard */}
                <Route path="app"    element={<PrivateRoute><Home /></PrivateRoute>}/>
                <Route path=""       element={<Navigate to="/dashboard/app" replace />}/>

                {/* config */}
                <Route path="ACcoUNt/securE"    element={<PrivateRoute><Security /></PrivateRoute>}/>
                <Route path="ACcoUNt/prOfile"    element={<PrivateRoute><Perfil /></PrivateRoute>}/>

                {/* users */}
                <Route path="admin/ACCounT"                     element={<PrivateRoute><CreateAccount /></PrivateRoute>}/>
                <Route path="rEstoRe/PAssWord"                  element={<PrivateRoute><RestorePassword/></PrivateRoute>}/>
                    {/* <Route path="aCtivE/ACCounT"            element={<PrivateRoute><InConstruction /></PrivateRoute>}/> */}
                <Route path="GroUP/aCCOunT"                     element={<PrivateRoute><AccountGroups /></PrivateRoute>}/>
                <Route path="grant/acCOUnT"                     element={<PrivateRoute><Permissions /></PrivateRoute>}/>
                    {/* <Route path="account/activate/"         element={<PrivateRoute><InConstruction /></PrivateRoute>}/> */}
                <Route path="Permissions/MeMbership/"           element={<PrivateRoute><Membership /></PrivateRoute>}/>

                {/* rrhh */}
                <Route path="rRHH/EmPloyEE/FILE"                element={<PrivateRoute><FichaPersonal /></PrivateRoute>}/>
                <Route path="RRhH/Cargos"                       element={<PrivateRoute><Cargos /></PrivateRoute>}/>

                {/* citas */}
                <Route path="appointment/admin"                 element={<PrivateRoute><AdministrarCita /></PrivateRoute>}/>
                <Route path="appointment/report"                element={<PrivateRoute><InformeMedico /></PrivateRoute>}/>
                <Route path="CITaS/AgEnt"                       element={<PrivateRoute><Agenda /></PrivateRoute>}/>
                <Route path="CITaS/historyByPatient/:id"        element={<PrivateRoute><PatientHistory /></PrivateRoute>}/>

                {/* inventario */}
                <Route path="InvenTorY/ADMIN"               element={<PrivateRoute><Inventario /></PrivateRoute>}/>
                <Route path="InVeNTorY/assigment"               element={<PrivateRoute><Asignacion /></PrivateRoute>}/>
                {/* <Route path="InvenTory/ADMIN"                   element={<PrivateRoute><Administracion /></PrivateRoute>}/> */}

                {/* finanzas */}
                <Route path="finace/vouCHer/"                   element={<PrivateRoute><Bills /></PrivateRoute>}/>
                <Route path="FinaNces/ChangeType"               element={<PrivateRoute><CurrencyExchange /></PrivateRoute>}/>

                {/* Tiendas */}
                <Route path='StoRE/ContraCts'                   element={<PrivateRoute><Contracts /></PrivateRoute>} />
                <Route path='sTOre/aDmon'                       element={<PrivateRoute><AdmTiendas /></PrivateRoute>} />

                {/* reportes */}
                <Route path="Reports/atencioN"          element={<PrivateRoute><Appointment /></PrivateRoute>}/>
                <Route path="RepOrts/InvEntario"        element={<PrivateRoute><Inventory /></PrivateRoute>}/>
                <Route path="Reports/RRHh"              element={<PrivateRoute><Rrhh /></PrivateRoute>}/>

                {/* Notificaciones */}
                <Route path='Notification/ws' element={<PrivateRoute> <Appointment /> </PrivateRoute>} />
            </Route>
            
            <Route path="*"       element={<Page404 />} />
            <Route path="/verify/email" element={<VerifyEmail />} />
            <Route path="/session-expired" element={<TokenExpired />} />
            <Route path="/login"  element={<Navigate to="/dashboard/app" replace />}/>
            <Route path="/"       element={<Navigate to="/dashboard/app" replace />}/>
        </Routes>
    )
}

export default Dashboard