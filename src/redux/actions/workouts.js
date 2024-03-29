import { FETCH_WORKOUTS, ADD_WOD_START, ADD_WOD_FINISH, ADD_WOD_FAILED, ADD_WORKOUT_FINISH, ADD_WORKOUT_FAILED, ADD_WORKOUT_START } from '../contants';
import { firestore, auth } from '../../config/config';
import moment from 'moment';

export const getWorkouts = () => dispatch => {
    firestore()
        .collection('users')
        .doc(auth().currentUser.email)
        .collection('workouts')
        .onSnapshot((res) => {
            if (!res?.empty) {
                const workouts = res.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                })
                const today = moment().format('DD-MM-YYYY');
                const week = moment().subtract(7, 'days').format('DD-MM-YYYY');
                const filterArrayBetweenTwoDates = workouts.filter(q => q.date >= week && q.date <= today && q.completed === true);

                const todayCalories = workouts.filter(q => q.date === moment().format('DD-MM-YYYY') && q.completed === true).reduce(function (prev, current) {
                    return prev + +parseFloat(current.kcal)
                }, 0);
                const weekCalories = filterArrayBetweenTwoDates.reduce(function (prev, current) {
                    return prev + +parseFloat(current.kcal)
                }, 0);
                const totalPoint = workouts.filter(q => q.completed === true).reduce(function (prev, current) {
                    return prev + +parseFloat(current.point)
                }, 0);

                dispatch({
                    type: FETCH_WORKOUTS,
                    todayCalories,
                    weekCalories,
                    calendarWorkouts: workouts,
                    workouts: workouts.filter(q => q.isWod === undefined || q.isWod === false),
                    wods: workouts.filter(q => q.isWod === true),
                    totalPoint,
                    loading: false
                })
            }
        })
}

export const addWorkout = data => {
    return async dispatch => {
        try {
            dispatch({ type: ADD_WORKOUT_START })
            await firestore().collection('users').doc(auth().currentUser.email).collection('workouts').add(data[0]);
            dispatch({ type: ADD_WORKOUT_FINISH })
        } catch (error) {
            dispatch({
                type: ADD_WORKOUT_FAILED,
                errorMsg: error.message,
                loading: false
            })
        }
    }
}


export const addWod = data => {
    return async dispatch => {
        try {
            dispatch({ type: ADD_WOD_START })
            await firestore().collection('users').doc(auth().currentUser.email).collection('workouts').add(data);
            dispatch({ type: ADD_WOD_FINISH })
        } catch (error) {
            dispatch({
                type: ADD_WOD_FAILED,
                errorMsg: error.message,
                loading: false
            })
        }
    }
}