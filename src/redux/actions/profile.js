export const FETCH_USERDATA = 'FETCH_USERDATA';
// import axios from 'axios';
import { database2 } from '../../config/config';

export const fetchUserData = userid => {
    return async dispatch => {
        database2.ref('users').child(userid).on("value", snapshot => {
            dispatch({ type: FETCH_USERDATA, users: { ...snapshot.val(), userId: userid } })
        });
    }
}