import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import WorkoutLayout from '../../../components/workout-layout';
import LottieView from "lottie-react-native";
import themeColors from '../../../styles/colors';
import styles from './style';
import { addWod } from '../../../redux/actions/workouts';

const WodCompleted = (props) => {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const Data = props.route.params.data;
    const Workouts = props.route.params.workouts;
    const Values = props.route.params.values;

    const SaveData = async () => {
        try {
            const date = moment().format("DD-MM-YYYY");
            const workoutData = {
                completed: true,
                date,
                description: Data.description,
                duration: Values.initialTime,
                time: Values.initialTime,
                kcal: Values.TotalKcal,
                point: Values.TotalPoint,
                type: profileData.values.target,
                workout: Workouts,
                isWod: true
            }
            dispatch(addWod(workoutData));
        } catch (error) {
            dispatch({ type: 'ADD_WOD_FAILED', errorMsg: error.message });
            Alert.alert('Hata', 'Bilgiler kaydedilirken bir sorun oluştu, lütfen tekrar deneyin.');
        }
    }

    useEffect(() => {
        SaveData();
    }, [])

    const GoHome = () => {
        props.navigation.navigate('Home');
    }

    return (
        <WorkoutLayout Loading={Loading}>
            <View style={styles.container}>
                <LottieView
                    style={styles.lottieView}
                    source={require("../../../assets/animations/check-mark.json")}
                    autoPlay
                    speed={0.5}
                    loop={false}
                    colorFilters={[
                        {
                            keypath: 'Circle Green Fill',
                            color: themeColors.yellow,
                        },
                        {
                            keypath: 'Circle Stroke',
                            color: themeColors.yellow,
                        },
                        {
                            keypath: 'Circle Flash',
                            color: themeColors.white
                        }
                    ]}
                />

                <Text allowFontScaling={false} style={styles.headerText}>Antrenman Kaydedildi!</Text>
                <Text allowFontScaling={false} style={styles.subText}>Antrenman başarıyla kaydedildi, daha fazla antrenman yaparak daha fazla puan kazanabilirsiniz.</Text>

            </View>

            <Pressable
                style={styles.bottomButton}
                onPress={GoHome}>
                <Text style={styles.textStyle}>Ana Sayfaya Dön</Text>
            </Pressable>

        </WorkoutLayout>
    )
}

export default WodCompleted;