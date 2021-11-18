import { showMessage } from "react-native-flash-message";
import {
    FETCH_WORKOUTS,
    FETCH_WORKOUTS_FAILED,
    ADD_WORKOUT,
    ADD_WORKOUT_FAILED,
    ADD_WORKOUT_START,
    ADD_WORKOUT_FINISH,
    DELETE_WORKOUT
} from "../contants";

const initialState = {
    workouts: [],
    todayCalories: 0,
    weekCalories: 0,
    totalPoint: 0,
    loading: true,
    errorMsg: ''
}

export const workoutsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_WORKOUTS:
            return {
                ...state,
                todayCalories: action.todayCalories,
                weekCalories: action.weekCalories,
                totalPoint: action.totalPoint,
                workouts: action.workouts,
                loading: action.loading
            };
        case FETCH_WORKOUTS_FAILED:
            showMessage({
                description: action.errorMsg,
                message: 'Antrenmanlar getirilemedi.',
                type: "danger",
                icon: "danger",
                hideStatusBar: true
            })
            return {
                ...state,
                errorMsg: action.errorMsg,
                loading: action.loading
            };
        case ADD_WORKOUT_START:
            return {
                ...state,
                loading: true
            };
        case ADD_WORKOUT_FINISH:
            return {
                ...state,
                loading: false
            };
        case ADD_WORKOUT_FAILED:
            showMessage({
                description: action.errorMsg,
                message: 'Bir hata oluştu.',
                type: "danger",
                icon: "danger",
                hideStatusBar: true
            })
            return {
                ...state,
                errorMsg: action.errorMsg,
                loading: false
            };
        case DELETE_WORKOUT:
            return {
                ...state,
                errorMsg: action.workouts,
                loading: action.loading
            };
        default:
            return state;
    }
};
