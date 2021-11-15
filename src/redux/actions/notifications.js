import { FETCH_NOTIFICATIONS, DELETE_NOTIFICATION, DELETE_ALL_NOTIFICATIONS } from '../contants';
import axios from 'axios';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// var PushNotification = require("react-native-push-notification");

export const fetchBildirimList = userid => {
    return async dispatch => {
        await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getBildirimler", { userid: userid })
            .then((res) => {
                dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: res.data, loading: false })
                // PushNotificationIOS.setApplicationIconBadgeNumber(res.data.length)
            })
            .catch((error) => {
                dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: [], loading: false })
            });
    }
}


export const deletenotification = (id) => {
    return async dispatch => {
        await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/BildirimiSil", { userid: id.userid, id: id.id })
            .then(async () => {
                await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getBildirimler", { userid: id.userid })
                    .then((res) => {
                        dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: res.data, loading: false })
                        // PushNotificationIOS.setApplicationIconBadgeNumber(res.data.length)
                    })
                    .catch((error) => {
                        // dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: [], loading: false })
                    });
            })
            .catch(() => {
                // dispatch({ type: DELETE_NOTIFICATION, bildirimid: id.id, loading: false })
            });
    }
}

export const deleteallnotifications = (id) => {
    return async dispatch => {
        await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/BildirimleriTemizle", { userid: id })
            .then(async () => {
                await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getBildirimler", { userid: id })
                    .then((res) => {
                        dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: res.data, loading: false })
                        // PushNotificationIOS.setApplicationIconBadgeNumber(res.data.length)
                    })
                    .catch((error) => {
                        // dispatch({ type: FETCH_NOTIFICATIONS, bildirimler: [], loading: false })
                    });
            })
            .catch((error) => {
                return null;
            });
    }
}