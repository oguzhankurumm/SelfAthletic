import {
    FETCH_HOMEDATA,
    FETCH_HOMEDATA_FAILED
} from "../contants";

const initialState = {
    wods: [],
    sliders: [],
    loading: true,
    errorMsg: ''
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_HOMEDATA:
            return {
                ...state,
                wods: action.wods,
                sliders: action.sliders,
                loading: action.loaded
            };
            break;
        case FETCH_HOMEDATA_FAILED:
            return {
                ...state,
                errorMsg: action.errorMsg,
                loading: action.loaded
            };
            break;
        default:
            return state;
    }
};
