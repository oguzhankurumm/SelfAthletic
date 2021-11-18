import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { healthReducer } from "./health";
import { notificationsReducer } from "./notifications";
import { workoutsReducer } from './workouts';
import { homeReducer } from "./home";

const Reducers = combineReducers({
    authReducer,
    healthReducer,
    notificationsReducer,
    workoutsReducer,
    homeReducer
})

export default Reducers;