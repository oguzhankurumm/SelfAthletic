import React, { useState, useEffect } from 'react'
import { firestore, auth } from '../../../config/config';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import SliderCard from '../../../components/slider-card';
import ImageLayout from '../../../components/image-layout';
import WodCard from '../../../components/wod-card';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const Home = () => {
    const profileData = useSelector(state => state.user.users);
    const fitnessData = useSelector(state => state.health.health);

    const [Loading, setLoading] = useState(false);
    const [Campaigns, setCampaigns] = useState([]);
    const [Workouts, setWorkouts] = useState([]);

    const CheckPermissions = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            try {
                const getToken = await messaging().getToken();
                await firestore().collection("users").doc(auth().currentUser.uid).update({
                    tokens: firestore.FieldValue.arrayUnion(getToken)
                })
            } catch (error) {
                console.log('GET TOKEN ERROR: ', error)
            }
        }
    }

    useEffect(() => {
        // CheckPermissions();
        getHomeData();
    }, [])

    const getHomeData = async () => {
        setLoading(true);
        await axios.all([
            axios.get('https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getSliders'),
            axios.get('https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getWodList')
        ])
            .then(axios.spread((data1, data2) => {
                setCampaigns(data1.data);
                setWorkouts(Object.values(data2.data).sort((a, b) => a.title.localeCompare(b.title)))
                setLoading(false);
            }))
            .catch(error => {
                setLoading(false);
                showMessage({
                    message: "Hata",
                    description: `Bir hata oluştu! Hata: ${error}`,
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
            })
    }

    return (
        <ImageLayout title="Ana Sayfa" Loading={Loading}>
            <SliderCard data={Campaigns} />
            <WodCard data={Workouts} />
        </ImageLayout>
    )
}

export default Home;