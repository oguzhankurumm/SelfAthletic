import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Pressable } from 'react-native';
import { firestore, auth } from '../../../config/config';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import WorkoutTodayChart from '../../../components/workouts/workout-today-chart';
import CalendarStrip from 'react-native-calendar-strip';
import ImageLayout from '../../../components/image-layout';
import WorkoutListCard from '../../../components/workouts/workout-list-card';
import styles from './style';
import { increaseMuscle10kVariables, increaseMuscle15kVariables, increaseMuscle20kVariables, fatReduction10kVariables, fatReduction15kVariables, fatReduction20kVariables, keepingFit10kVariables, keepingFit15kVariables, keepingFit20kVariables } from '../../../data/workout-variables';
import { increaseMuscle10k, increaseMuscle15k, increaseMuscle20k, fatReduction10k, fatReduction15k, fatReduction20k, keepingFit10k, keepingFit15k, keepingFit20k } from '../../../data/workout-types';
import axios from 'axios';

const Workout = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);
    const fitnessData = useSelector(state => state.health.health);
    const [Loading, setLoading] = useState(false);
    const [Workouts, setWorkouts] = useState([]);
    const [WorkoutList, setWorkoutList] = useState([]);

    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(new Date());
    const datesBlacklist = [{ start: moment().add(1, 'days'), end: moment().add(10, 'days') }];

    useEffect(() => {
        checkWorkouts();
    }, [])

    const checkWorkouts = async () => {
        setLoading(true);
        const date = moment().format('DD-MM-YYYY');
        const workouts = await firestore().collection('users').doc(profileData.userId).collection('workouts').where('date', '==', date).get();
        if (!workouts.empty) {
            const workoutData = workouts.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });
            setWorkoutList(workoutData);
            setLoading(false);
        } else {
            createWorkout();
        }
    }


    function shuffle(array, number) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array.length > 0 ? array.slice(0, number) : array;
    }

    const getWorkoutVideos = async (data, variable) => {
        const moveData = Object.values(data).map(async item => {
            try {
                const res = await axios.get(`https://player.vimeo.com/video/${item.video}/config`)
                if (res.status === 200) {
                    const videoData = {
                        size: res.data.request.files.progressive[2].width,
                        url: res.data.request.files.progressive[2].url,
                        thumb: res.data.video.thumbs[640],
                        title: res.data.video.title,
                        duration: res.data.video.duration
                    }

                    let itemValue = null;

                    if (item.category === "Core Egzersizi" && item.type === "time") {
                        itemValue = variable.core.time
                    } else if (item.category === "Core Egzersizi" && item.type === "reps") {
                        itemValue = variable.core.repeat;
                    } else if (item.category === "Mobilite ve Dinamik Isınma" && item.type === "time") {
                        itemValue = variable.mobility.time;
                    } else if (item.category === "Mobilite ve Dinamik Isınma" && item.type === "reps") {
                        itemValue = variable.mobility.repeat;
                    } else if (item.category === "Üst Vücut") {
                        itemValue = variable.ust.all;
                    } else if (item.category === "Alt Vücut") {
                        itemValue = variable.alt.all;
                    } else if (item.category === "Statik Stretching") {
                        itemValue = variable.statik.all;
                    } else {
                        console.log('bulunamadı')
                    }

                    return {
                        ...item,
                        values: itemValue,
                        videoData
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })

        Promise.all(moveData)
            .then((data) => {
                const moves = data.flat();
                const otherMoves = moves.filter(q => q.category !== "Statik Stretching");
                const staticMovesStart = moves.filter(q => q.category === "Statik Stretching").slice(0, 4);
                const staticMovesEnd = moves.filter(q => q.category === "Statik Stretching").slice(4, 8);
                const newMoves = [];
                newMoves.push(...staticMovesStart, ...otherMoves, ...staticMovesEnd)
                setWorkouts(newMoves);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                Alert.alert('HAta', 'Bir hata oluştu. Lütfen tekrar deneyiniz.');
                console.log('promise error', error)
            })
    }

    const createWorkout = async () => {
        setLoading(true);
        const profilePoint = profileData.point;
        const gender = profileData.gender === "male" ? "Erkek" : "Kadin";
        const userTarget = profileData.values.target;

        const targetData = () => {
            if (userTarget === "Kas Kütlesi Artışı" && profilePoint < 10000) return { variable: increaseMuscle10kVariables, data: increaseMuscle10k };
            if (userTarget === "Kas Kütlesi Artışı" && profilePoint >= 10000 && profilePoint < 15000) return { variable: increaseMuscle15kVariables, data: increaseMuscle15k };
            if (userTarget === "Kas Kütlesi Artışı" && profilePoint >= 15000) return { variable: increaseMuscle20kVariables, data: increaseMuscle20k };
            if (userTarget === "Formda Kalma" && profilePoint < 10000) return { variable: keepingFit10kVariables, data: keepingFit10k };
            if (userTarget === "Formda Kalma" && profilePoint >= 10000 && profilePoint < 15000) return { variable: keepingFit15kVariables, data: keepingFit15k };
            if (userTarget === "Formda Kalma" && profilePoint >= 15000) return { variable: keepingFit20kVariables, data: keepingFit20k };
            if (userTarget === "Yağ Oranı Azaltma" && profilePoint < 10000) return { variable: fatReduction10kVariables, data: fatReduction10k };
            if (userTarget === "Yağ Oranı Azaltma" && profilePoint >= 10000 && profilePoint < 15000) return { variable: fatReduction15kVariables, data: fatReduction15k };
            if (userTarget === "Yağ Oranı Azaltma" && profilePoint >= 15000) return { variable: fatReduction20kVariables, data: fatReduction20k };
        }

        try {
            const getAll = Object.values(targetData().data).map(async item => {
                const workoutRes = await firestore().collection('workouts')
                    .where('category', '==', String(item.name))
                    .where('gender', 'array-contains', gender)
                    .get()
                const getWorkouts = shuffle(workoutRes.docs.map(workout => {
                    if (workout.exists) {
                        return {
                            ...workout.data(),
                            id: workout.id
                        }
                    }
                }), item.count)
                return getWorkouts;
            })

            Promise.all(getAll)
                .then((data) => {
                    const datas = data.flat()
                    getWorkoutVideos(datas, targetData().variable);
                })
                .catch(error => {
                    setLoading(false);
                    console.log('promise error', error)
                })
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


    return (
        <ImageLayout
            title="Antrenman"
            Loading={Loading}
            isScrollable={true}
        >
            {!Loading &&
                <FlatList
                    style={{ flex: 1, paddingHorizontal: 20 }}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={WorkoutList}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => (
                        <View style={{ width: '100%' }}>
                            {!Loading &&
                                <>
                                    <WorkoutTodayChart
                                        stepCount={fitnessData.steps.length !== 0 ? parseFloat(fitnessData.steps[7].quantity).toFixed(0) : 0}
                                        calorieCount={parseFloat(fitnessData.calories).toFixed(0)}
                                    />
                                    <CalendarStrip
                                        scrollable={true}
                                        datesBlacklist={datesBlacklist}
                                        selectedDate={SelectedDate}
                                        maxDate={moment()}
                                        minDate={moment().subtract(31, 'days')}
                                        // onDateSelected={(val) => getSelectedDay(val)}
                                        showMonth={false}
                                        style={{ padding: 10 }}
                                        daySelectionAnimation={{ type: 'background', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                                        calendarHeaderStyle={{ color: 'white' }}
                                        dateNumberStyle={{ color: 'white' }}
                                        dateNameStyle={{ color: 'white' }}
                                        highlightDateNumberStyle={{ color: 'yellow' }}
                                        highlightDateNameStyle={{ color: 'yellow' }}
                                        disabledDateNameStyle={{ color: 'grey' }}
                                        disabledDateNumberStyle={{ color: 'grey' }}
                                        markedDates={markedDatesArray}
                                        iconRight={null}
                                        iconLeft={null}
                                    />

                                    <Pressable
                                        onPress={() => navigation.navigate('StartWorkout', { data: Workouts })}
                                        style={styles.startButton}
                                    >
                                        <Text style={styles.startButtonText}>Antrenmanı Başlat</Text>
                                    </Pressable>
                                </>
                            }
                        </View>
                    )}
                    renderItem={(workouts) => {
                        return (workouts.item &&
                            <WorkoutListCard data={workouts.item.workout} />
                        )
                    }}
                />
            }
        </ImageLayout>
    )
}

export default Workout;