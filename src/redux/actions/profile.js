export const FETCH_USERDATA = 'FETCH_USERDATA';
// import axios from 'axios';
import { database2 } from '../../config/config';
import moment from 'moment';

export const fetchUserData = userid => {
    return async dispatch => {
        let pointList = [];
        let totalPoint = 0;

        database2.ref('users_points').child(userid).on("value", point => {
            if (point.exists) {
                point.forEach((pt) => {
                    pointList.push(pt.val());
                })
                let sum = pointList.reduce(function (prev, current) {
                    return prev + +parseFloat(current.point)
                }, 0);
                totalPoint = sum;
            } else {
                totalPoint = 0;
            }
        })

        database2.ref('users').child(userid).on("value", snapshot => {
            database2.ref('userSubscriptions').child(userid + '/expireDate').once('value')
                .then((res) => {
                    const currentDate = moment().unix()
                    if (res.exists) {
                        if (res.val() < currentDate) {
                            dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: false, point: totalPoint } })
                        } else {
                            dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: true, point: totalPoint } })
                        }
                    } else {
                        dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: false, point: totalPoint } })
                    }
                })
                .catch((err) => {
                    dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid, isPremium: true, point: totalPoint } })
                })
        });
    }
}

