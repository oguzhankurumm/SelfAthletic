import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { firestore, auth } from '../../config/config';
import { FETCH_HEALTH, ADD_CALORIE } from '../contants';

export const fetchHealth = () => {
    const permissions = [
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Write }
    ];
    return async dispatch => {
        const isAuth = await Fitness.requestPermissions(permissions);
        const userEmail = auth().currentUser.email;
        let totalCalories = 0;
        var Data = [];
        var TotalSteps = 0;

        if (isAuth) {
            const convertStartDate = moment().subtract(7, 'days').local().toDate();
            const convertEndDate = moment().toDate();
            const userSteps = await Fitness.getSteps({ startDate: convertStartDate, endDate: convertEndDate })

            Data['Steps'] = userSteps;
            if (userSteps.length !== 0) {
                let sum = userSteps.reduce(function (prev, current) {
                    return prev + +parseFloat(current.quantity)
                }, 0);
                TotalSteps = sum;
            }
        }

        try {
            const getCalories = await firestore().collection('users').doc(userEmail).collection('workouts').where('completed', '==', true).get();
            if (!getCalories.empty) {
                const calorieRes = getCalories.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    }
                })
                let sum = calorieRes.reduce(function (prev, current) {
                    return prev + +parseFloat(current.kcal)
                }, 0);
                totalCalories = sum;
            }
        } catch (error) {
            console.log('cant get calories from db');
        }

        dispatch({ type: FETCH_HEALTH, steps: Data.Steps, totalSteps: parseFloat(TotalSteps).toFixed(0), totalCalories: totalCalories })
    }
}

export const addCalorie = (value) => {
    return async dispatch => {
        dispatch({ type: ADD_CALORIE, value: parseInt(value) })
    }
}
