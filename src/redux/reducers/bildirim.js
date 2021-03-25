import { FETCH_NOTIFICATIONS, DELETE_NOTIFICATION, DELETE_ALL_NOTIFICATIONS } from '../actions/bildirim';

const initialState = {
    bildirimler: []
}

const bildirimReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTIFICATIONS:
            return {
                bildirimler: action.bildirimler
            };
        default:
            return state;
    }
};

export default bildirimReducer;