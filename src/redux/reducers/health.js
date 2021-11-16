import { FETCH_HEALTH, ADD_CALORIE } from '../contants/index';

const initialState = {
    steps: 0,
    calories: 0,
    totalSteps: 0,
    totalCalories: 0,
    loaded: false
}

export const healthReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_HEALTH:
            return {
                ...state,
                steps: action.steps,
                calories: action.calories,
                totalSteps: action.totalSteps,
                totalCalories: action.totalCalories
            };
        case ADD_CALORIE:
            return {
                ...state,
                totalCalories: parseInt(state.totalCalories) + parseInt(action.value)
            };
        default:
            return state;
    }
};
