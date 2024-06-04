import axios from 'axios';
import {CHANGE_USER_DATA, LOGIN, LOGOUT, SET_USER_DATA, SET_SETTINGS} from '../types'

export const handleLogin = (data) => dispatch => {
    dispatch({
        type:    LOGIN,
        payload: data
    })
}

export const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];

    return dispatch => {
        dispatch({
            type: LOGOUT
        });
    }
}

export const set_user_data = (data) => dispatch => {
        dispatch({
            type: SET_USER_DATA,
            payload: data
        });
    }

export const change_user_data = (data) => {
    console.log('Modificando datos personales');
    
    return dispatch => {
        dispatch({
            type: CHANGE_USER_DATA,
            payload: data
        });
    }
}

export const set_settings = () => {
    let url = '/accounts/list-settings/';

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            if(res.data){
                console.log(res.data);
                dispatch({
                    type: SET_SETTINGS,
                    payload: res.data
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}