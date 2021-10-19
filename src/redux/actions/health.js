export const FETCH_HEALTH = 'FETCH_HEALTH';
// import axios from 'axios';
import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { database, auth } from '../../config/config';

export const fetchHealth = () => {
    const permissions = [
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Write },
        { kind: Fitness.PermissionKinds.Distances, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Distances, access: Fitness.PermissionAccesses.Write },
        { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Write }
    ];
    return async dispatch => {
        Fitness.requestPermissions(permissions)
            .then(async (authorized) => {
                var Data = [];
                var TotalSteps = 0;
                var TotalCalories = 0;
                // const result = await check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION)
                // console.log("RESUL", result);
                // console.log('presss', authorized)

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


                let caloriesD = 0;
                await database().ref(`users_points/${auth().currentUser.uid}`).once('value')
                    .then(snapshot => {
                        if (snapshot.val().length !== 0) {
                            snapshot.forEach((item) => {
                                caloriesD = parseFloat(caloriesD) + parseFloat(item.val().calories)
                            })
                        }
                    })
                    .catch(err => console.log('get point err: ', err))

                await Fitness.getCalories({
                    startDate: convertStartdate, // required
                    endDate: convertEndDate, // required
                }).then((res) => {
                    Data['Calories'] = res;
                    if (res.length !== 0) {
                        let sum = res.reduce(function (prev, current) {
                            return prev + +parseFloat(current.quantity)
                        }, 0);
                        TotalCalories = sum + caloriesD;
                    } else {
                        TotalCalories = caloriesD;
                    }
                });



                dispatch({ type: FETCH_HEALTH, health: { calories: Data.Calories, steps: Data.Steps, totalSteps: TotalSteps, totalCalories: TotalCalories } })
            }).catch((error) => {
                console.log('hata: ', error)
                //   // Do something
            });
    }
}

