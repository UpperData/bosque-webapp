import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

// root reducer
import Reducer from './rootReducer'

const middleware = [thunkMiddleware];

const store = createStore(Reducer, composeWithDevTools(
    applyMiddleware(...middleware),
));

export default store;