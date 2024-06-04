// /src/hooks/useAuth.tsx
import React, { useState, createContext, useContext, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux"
import axios from "./fetch"

import {handleLogin, handleLogout} from "../store/session/actions"

// Create the context 
const AuthContext = createContext(null);
const AUTH_TOKEN 			= 'authTkn'

export const AuthProvider = ({ children }) => {

	// Using the useState hook to keep track of the value authed (if a 
    // user is logged in)

    const dispatch          = useDispatch();
    const session           = useSelector(state => state.session);
    const [auth, setAuth]   = useState(session.auth);

    // console.log("Is authenticate:"+auth);

    const login = async (nick, pass) => {
        await axios({
            method: "post",
            url: "/loGin/byUSErpAss",
            data: {
              nick,
              pass
            }
        }).then(async (res) => {
            // console.log(res);
            let token = res.data.token;
            localStorage.setItem(AUTH_TOKEN, token);
            await dispatch(handleLogin(res));

            return res.data;
        }).catch((err) => {
            console.log(err);
            if(err.response){
                return Promise.reject(err.response.data.data);

                // return err.response.data.data;
            }
        });
    };

    const loginByToken = async (token) => {
        // localStorage.removeItem(AUTH_TOKEN);
        // delete axios.defaults.headers.common["Authorization"];
        
        
        await axios({
            method: "get",
            url: `/login/${token}`
        }).then(async (res) => {
            // console.log(res);
            let token = res.data.token;
            localStorage.setItem(AUTH_TOKEN, token);
            await dispatch(handleLogin(res));

            return res;
        }).catch((err) => {
            // console.log(err);
            throw err;
        });
        
        
    };

    const logout = async () => {
        localStorage.removeItem(AUTH_TOKEN);
        delete axios.defaults.headers.common["Authorization"];

        await dispatch(handleLogout());
    };

    /// Mock Async Login API call.
    // TODO: Replace with your actual login API Call code
    const fakeAsyncLogin = async () => {
        /*
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("Logged In");
                }, 300);
            });
        */
    };

    // Mock Async Logout API call.
    // TODO: Replace with your actual logout API Call code
    const fakeAsyncLogout = async () => {
            /*
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve("The user has successfully logged on the server");
                    }, 300);
                });
            */
    };

    return (
            // Using the provider so that ANY component in our application can 
            // use the values that we are sending.

            <AuthContext.Provider value={{ auth, login, logout, loginByToken }}>
                {children}
            </AuthContext.Provider>
    );
};

// Finally creating the custom hook 
export const useAuth = () => useContext(AuthContext);