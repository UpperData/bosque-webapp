import React from 'react'
import PropTypes from 'prop-types';
import {Routes, Route, Navigate} from "react-router-dom"

import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import Login from './content/Login';
import RestorePasswordUser from './content/RestorePasswordUser';
import TokenExpired from '../shared/TokenExpired';
import Page404 from '../shared/Page404';
import RestorePassSuccess from '../shared/RestorePasswordSuccess';
import VerifyEmail from '../shared/verifyEmail';

function PublicRoute({ children }) {
    // const auth = useAuth();
    let isAuth = false;
    return isAuth ? <Navigate to="/dashboard" /> : children;
}

PublicRoute.propTypes = {
    children: PropTypes.object.isRequired
};

function Public() {
    return (
        <Routes>
            <Route path="/" element={<LogoOnlyLayout />} >
                <Route path="login" element={<PublicRoute><Login /></PublicRoute>}/>
                <Route path="restore-password" element={<PublicRoute><RestorePasswordUser /></PublicRoute>}/>

                <Route path="session-expired" element={<PublicRoute><TokenExpired /></PublicRoute>}/>
                <Route path=""      element={<Navigate to="/login" replace />}/>
            </Route>

            <Route path="/dashboard">
                <Route path="*"     element={<Navigate to="/" replace />}/>
            </Route>

            <Route path="/restore-password/success" element={<PublicRoute><RestorePassSuccess /></PublicRoute>}/>
            <Route path="/verify/email" element={<VerifyEmail />} />

            <Route path="*"       element={<Page404 />} />
        </Routes>
    )
}

export default Public