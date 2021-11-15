// import axios from 'axios';
import { firestore, auth } from '../../config/config';
import {
    USER_STATE_CHANGE,
    USER_LOGOUT,
    USER_LOGOUT_FAILED
} from '../contants';
import * as notificationsActions from './notifications';
import * as healthActions from './health';
import * as homeActions from './home';

export const userAuthStateListener = () => dispatch => {
    auth().onAuthStateChanged((user) => {
        if (user) {
            dispatch(getCurrentUserData());
            dispatch(homeActions.getHomeData());
            dispatch(notificationsActions.fetchBildirimList(user.email));
            dispatch(healthActions.fetchHealth());
        } else {
            dispatch({ type: USER_STATE_CHANGE, currentUser: null, loaded: true })
        }
    })
}

export const getCurrentUserData = () => dispatch => {
    firestore()
        .collection('users')
        .doc(auth().currentUser.email)
        .onSnapshot((res) => {
            if (res.exists) {
                return dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: {
                        ...res.data(),
                        userId: auth().currentUser.email,
                        isPremium: true,
                        point: 500
                    },
                    loaded: true
                })
            }
        })
}

export const logout = () => dispatch => {
    try {
        dispatch({
            type: USER_LOGOUT
        })
        auth().signOut();
    } catch (error) {
        dispatch({
            type: USER_LOGOUT_FAILED
        })
    }
}