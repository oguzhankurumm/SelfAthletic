export const FETCH_USERDATA = 'FETCH_USERDATA';
// import axios from 'axios';
import { database2 } from '../../config/config';
import moment from 'moment';

export const fetchUserData = userid => {
    return async dispatch => {
        database2.ref('users').child(userid).on("value", snapshot => {
            database2.ref('userSubscriptions').child(userid + '/expireDate').once('value')
                .then((res) => {
                    const currentDate = moment().unix()
                    if (res.val() < currentDate) {
                        dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: false } })
                    } else {
                        dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: true } })
                    }
                })
                .catch((err) => {
                    dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: true } })
                })
        });
    }
}

