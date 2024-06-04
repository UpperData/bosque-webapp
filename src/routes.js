import {useState, useEffect} from "react"
import { Navigate, useRoutes, Routes } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux"

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import { useAuth } from "./auth/AuthProvider";
import Loader from "./components/Loader/Loader"

//
// import Login from './pages/Login';
// import Register from './pages/Register';
// import DashboardApp from './pages/dashboard/content/DashboardApp';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
// import User from './pages/User';
// import NotFound from './pages/Page404';


import Dashboard from "./pages/dashboard/Dashboard";
import Public from "./pages/public/Public";
// ----------------------------------------------------------------------

function Router() {

  // const dispatch              = useDispatch();

  const session               = useSelector(state => state.session);
  const auth                  = session.auth;

  // const [loged, setloged]             = useState(false);
  // const [loadingData, setLoadingData] = useState(true);

  const [loading, setloading]             = useState(true);
  const [loaded, setloaded]               = useState(false);
  const [searchSession, setsearchSession] = useState(true);
  const [loadingData, setloadingData]     = useState(false);

  const AUTH_TOKEN 			      = 'authTkn'
  const {loginByToken}        = useAuth();

  let failRequestByToken      = false;

  async function handleLoginByToken(){
    let token = localStorage.getItem(AUTH_TOKEN);
    
    await loginByToken(token);
    setloadingData(true);
  }

  useEffect(() => {
    if(!loaded){
      if(loading){

        let token = localStorage.getItem(AUTH_TOKEN);

        if(searchSession && loadingData === false){
          // Buscando datos de sesion anterior por token almacenado
          setsearchSession(false);
          if(token){
            handleLoginByToken();
          }else{
            setloadingData(true);
          }
        }else if(loadingData && !searchSession){
          if(auth && token){
            // Buscar datos para el render del router privado
            setloaded(true);
          }else{
            // no se cargan datos adicionales y entra en el router publico
            setloaded(true);
          }
        }

      }
    }
  });
  
  if(!loaded){
    return <Loader isFullPage />
  }

  if(auth){
    return <Dashboard />
  }

  return <Public />
}

export default Router


