// modules
import {combineReducers} from 'redux'

// reducers
import sessionReducer from './session/reducer'
import dashboardReducer from './dashboard/reducer'

const rootReducer = combineReducers({
    session:    sessionReducer,
    dashboard:  dashboardReducer
});

export default rootReducer;