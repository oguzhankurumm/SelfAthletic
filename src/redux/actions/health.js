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
        Fitness.requestPermissions(permissions)
            .then(async (authorized) => {
                const userEmail = auth().currentUser.email;
                let totalCalories = 0;
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
                    console.log('fetch calories error', error)
                }

                var Data = [];
                var TotalSteps = 0;

                var convertStartdate = moment().subtract(7, 'days').local().toDate();
                var convertEndDate = moment().toDate();
                await Fitness.getSteps({
                    startDate: convertStartdate, // required
                    endDate: convertEndDate, // required
                }).then((res) => {
                    Data['Steps'] = res;
                    if (res.length !== 0) {
                        let sum = res.reduce(function (prev, current) {
                            return prev + +parseFloat(current.quantity)
                        }, 0);
                        TotalSteps = sum;
                    }
                });
                dispatch({ type: FETCH_HEALTH, steps: Data.Steps, totalSteps: TotalSteps, totalCalories: totalCalories })
            }).catch((error) => {
                console.log('hata: ', error)
                //   // Do something
            });
    }
}

export const addCalorie = (value) => {
    return async dispatch => {
        dispatch({ type: ADD_CALORIE, value: parseInt(value) })
    }
}
