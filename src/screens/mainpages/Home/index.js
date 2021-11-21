import React, { useEffect } from 'react'
import { auth, firestore } from '../../../config/config';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import SliderCard from '../../../components/slider-card';
import ImageLayout from '../../../components/image-layout';
import WodCard from '../../../components/wod-card';
import WorkoutChart from '../../../components/workouts/workout-chart';
import moment from 'moment';

const Home = () => {
    const homeData = useSelector(state => state.homeReducer);
    const Loading = useSelector(state => state.homeReducer.loading)
    const fitnessData = useSelector(state => state.healthReducer);
    const weekCalories = useSelector(state => state.workoutsReducer.weekCalories);

    const CheckPermissions = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            try {
                const getToken = await messaging().getToken();
                await firestore().collection("users").doc(auth().currentUser.email).update({
                    tokens: firestore.FieldValue.arrayUnion(getToken)
                })
            } catch (error) {
                console.log('GET TOKEN ERROR: ', error)
            }
        }
    }

    useEffect(() => {
        CheckPermissions();
    }, [])

    return (
        <ImageLayout title="Ana Sayfa" Loading={Loading}>
            <SliderCard data={homeData.sliders} />
            <WodCard data={homeData.wods} />
            <WorkoutChart
                days="Bu Hafta"
                newStyle={{ marginTop: 20 }}
                stepCount={fitnessData.totalSteps !== undefined ? parseFloat(fitnessData.totalSteps).toFixed(0) : 0}
                calorieCount={weekCalories !== undefined ? parseFloat(weekCalories).toFixed(1) : 0}
            />
        </ImageLayout>
    )
}

export default Home;