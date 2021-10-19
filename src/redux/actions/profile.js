export const FETCH_USERDATA = 'FETCH_USERDATA';
import { firestore } from '../../config/config';

export const fetchUserData = userid => {
    return async dispatch => {
        firestore()
            .collection('users')
            .doc(userid)
            .onSnapshot((res) => {
                if (res.exists) {
                    return dispatch({
                        type: FETCH_USERDATA,
                        users: {
                            ...res.data(),
                            userId: userid,
                            isPremium: true,
                            point: 500
                        },
                        loaded: true
                    })
                }
            })
    }
}

