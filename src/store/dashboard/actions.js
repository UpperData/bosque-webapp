import axios from '../../auth/fetch';
import {SET_MENU, SET_ROLE, SET_CIVIL_STATUS_TYPES, SET_PHONE_TYPES_LIST, SET_PATIENT_TYPES, SET_PERSONAL_TYPES, SET_APPOINTMENT_TYPES, SET_MEMBERSHIPS} from '../types'

export const set_menu = (role) => {
    let url = `/panel/mEnu/GeT/${role}`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_MENU,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}


export const set_role = (role) => {
    let dataRole = role;
    localStorage.setItem("role", JSON.stringify(role));
    
    return async dispatch => {
        dispatch({
            type: SET_ROLE,
            payload: dataRole
        })
            
    }
}

export const set_phone_types_list = () => {
    let url = `/phone/get/type/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_PHONE_TYPES_LIST,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}

export const set_civil_status_types_list = () => {
    let url = `/civil/get/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_CIVIL_STATUS_TYPES,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}

export const set_patient_types = () => {
    let url = `/pAtieNt/TYPE/geT/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_PATIENT_TYPES,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}

export const set_personal_types = () => {
    let url = `/pAtieNt/TYPE/geT/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_PERSONAL_TYPES,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}

export const set_appointment_types = () => {
    let url = `/APpOINtMENt/typE/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res){
                dispatch({
                    type: SET_APPOINTMENT_TYPES,
                    payload: res
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}

export const set_memberships = () => {
    let url = `/front/Role/get/*`;

    return async dispatch => {
        await axios
          .get(url)
          .then(res => {
            // console.log(res);

            if(res.data.result){
                dispatch({
                    type: SET_MEMBERSHIPS,
                    payload: res.data.data
                })
            }
          })
          .catch(err => console.log(err + "action"))
    }
}