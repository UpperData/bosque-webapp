import {LOGIN, LOGOUT, SET_USER_DATA, CHANGE_USER_DATA, SET_SETTINGS} from '../types'

const initialState = {
    auth: false,
    userData : null,
    settings: null
}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return{
               ...state,
               auth: true,
               userData: action.payload
            };
        
        case LOGOUT:
            return{
               ...state,
               auth: false,
               userData : null,
               settings: null
            };

        case SET_USER_DATA:
            return{
                ...state,
                userData: action.payload
            };
        
        case SET_SETTINGS:
            return{
                ...state,
                settings: action.payload
            };
    
        default: return state;
    }
}

export default sessionReducer;