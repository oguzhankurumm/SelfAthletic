import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { healthReducer } from "./health";
import { notificationsReducer } from "./notifications";
import { homeReducer } from "./home";

const Reducers = combineReducers({
    authReducer,
    healthReducer,
    notificationsReducer,
    homeReducer
})

export default Reducers;