import { combineReducers } from 'redux';
import { sellerReducer } from './sellerReducer';
import { userReducer } from './userReducer';
import  userProfileReducer from "./userProfileReducer";

const reducers = combineReducers({
    sellers: sellerReducer,
    users: userReducer,
    user: userProfileReducer,
})

export default reducers