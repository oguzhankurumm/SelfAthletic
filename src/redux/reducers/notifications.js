import { FETCH_NOTIFICATIONS, DELETE_NOTIFICATION, DELETE_ALL_NOTIFICATIONS } from '../actions/notifications';

const initialState = {
    notifications: []
}

export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTIFICATIONS:
            return {
                notifications: action.bildirimler
            };
        default:
            return state;
    }
};