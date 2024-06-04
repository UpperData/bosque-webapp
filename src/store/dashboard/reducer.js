import {SET_MENU, SET_ROLE, SET_CIVIL_STATUS_TYPES, SET_PHONE_TYPES_LIST, SET_PATIENT_TYPES, SET_PERSONAL_TYPES, SET_APPOINTMENT_TYPES, SET_MEMBERSHIPS} from '../types'

const initialState = {
    menu:               null,
    role:               null,
    civilStatusTypes:   null,
    phoneTypesList:     null,
    patientTypes:       null,

    personalTypes:      null,
    appointmentTypes:   null,  
    memberships:        null  
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU:
            return{
               ...state,
               menu: action.payload
            };

        case SET_ROLE:
            return{
                ...state,
                role: action.payload
            };

        case SET_CIVIL_STATUS_TYPES:
            return{
                ...state,
                civilStatusTypes: action.payload
            };

        case SET_PHONE_TYPES_LIST:
            return{
                ...state,
                phoneTypesList: action.payload
            };

        case SET_PATIENT_TYPES:
            return{
                ...state,
                patientTypes: action.payload
            };

        case SET_PERSONAL_TYPES:
            return{
                ...state,
                personalTypes: action.payload
            };

        case SET_APPOINTMENT_TYPES:
            return{
                ...state,
                appointmentTypes: action.payload
            };

        case SET_MEMBERSHIPS:
            return{
                ...state,
                memberships: action.payload
            };
        
        default: return state;
    }
}

export default dashboardReducer;