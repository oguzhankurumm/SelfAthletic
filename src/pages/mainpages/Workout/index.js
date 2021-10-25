import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, Alert } from 'react-native';
import { firestore, auth } from '../../../config/config';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
import axios from 'axios';
import ImageLayout from '../../../components/image-layout';
import MoveCard from '../../../components/workouts/move-card';
import styles from './style';
import { increaseMuscle10kVariables, increaseMuscle15kVariables, increaseMuscle20kVariables, fatReduction10kVariables, fatReduction15kVariables, fatReduction20kVariables, keepingFit10kVariables, keepingFit15kVariables, keepingFit20kVariables } from '../../../data/workout-variables';
import { increaseMuscle10k, increaseMuscle15k, increaseMuscle20k, fatReduction10k, fatReduction15k, fatReduction20k, keepingFit10k, keepingFit15k, keepingFit20k } from '../../../data/workout-types';

const Workout = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);
    const fitnessData = useSelector(state => state.health.health);
    const [Loading, setLoading] = useState(false);
    const [Workouts, setWorkouts] = useState([]);

    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(moment());
    const datesBlacklist = [{ start: moment().add(1, 'days'), end: moment().add(10, 'days') }];

    useEffect(() => {
        console.log({ profileData })
        createWorkout();
    }, [])


    function shuffle(a, number, type, variable) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            
            switch (type) {
                case "core":
                    if (a[j].type === "time") {
                        a[j] = { ...x, ...variable.core.time };
                    } else {
                        a[j] = { ...x, ...variable.core.reps }
                    }
                    break;
                case "mobilite":
                    if (a[j].type === "time") {
                        a[j] = { ...x, ...variable.mobilite.time };
                    } else {
                        a[j] = { ...x, ...variable.mobilite.reps }
                    }
                    break;
                case "top":
                    a[j] = { ...x, ...variable.ust.all };
                    break;
                case "bottom":
                    a[j] = { ...x, ...variable.alt.all };
                    break;   
                case "statik":
                    a[j] = { ...x, ...variable.statik.all };
                    break;
                default:
                    console.log('undefined')
                    break;
            }

        }
        return a.length > 0 ? a.slice(0, number) : a;
    }

    const createWorkout = async () => {
        setLoading(true);
        const profilePoint = 1200;
        const gender = "Erkek";
        const userTarget = "Formda Kalma";
 
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
                    .where('category', '==', 'Core Egzersizi')
                    .where('gender', 'array-contains', gender)
                    .get()
                const getWorkouts = shuffle(workoutRes.docs.map(item => {
                    if (item.exists) {
                        return {
                            ...item.data(),
                            id: item.id,
                        }
                    }
                }), item.count, item.type, targetData().variable)
                return getWorkouts;
            })

            Promise.all(getAll)
                .then((data) => {
                    setWorkouts(data.flat().sort((a, b) => a.category.localeCompare(b.category)));
                    console.log({ data })
                    setLoading(false);
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
            <View style={{ width: '100%', paddingHorizontal: 10 }}>
                {!Loading &&
                    <CalendarStrip
                        scrollable={true}
                        datesBlacklist={datesBlacklist}
                        selectedDate={SelectedDate}
                        maxDate={moment()}
                        minDate={moment().subtract(31, 'days')}
                        // onDateSelected={(val) => getSelectedDay(val)}
                        showMonth={false}
                        style={{ paddingVertical: 10 }}
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
                }
            </View>

            {!Loading &&
                <FlatList style={{ flex: 1, paddingHorizontal: 20 }}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={Workouts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(workouts) => {
                        return (workouts.item &&
                            <MoveCard data={workouts.item} />
                        )
                    }}
                />
            }
        </ImageLayout>
    )
}

export default Workout;