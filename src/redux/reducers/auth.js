import {
    USER_STATE_CHANGE,
    USER_LOGOUT,
    USER_LOGOUT_FAILED
} from "../contants";

const initialState = {
    currentUser: null,
    loaded: false,
    errorMsg: '',
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser,
                loaded: action.loaded
            };
        case USER_LOGOUT:
            return {
                ...state,
                currentUser: null,
                loaded: true
            };
        case USER_LOGOUT_FAILED:
            return {
                ...state,
                currentUser: null,
                loaded: true
            };
        default:
            return state;
    }
};
