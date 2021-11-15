import { FETCH_HEALTH } from '../actions/health';

const initialState = {
    health: {
        totalSteps: 0,
        totalCalories: 0
    },
    loaded: false
}

export const healthReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_HEALTH:
            return {
                ...state,
                health: action.health
            };
        default:
            return state;
    }
};
