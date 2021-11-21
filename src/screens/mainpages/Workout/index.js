import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Alert, Pressable, Dimensions } from 'react-native';
import { firestore } from '../../../config/config';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import WorkoutChart from '../../../components/workouts/workout-chart';
import CalendarStrip from 'react-native-calendar-strip';
import ImageLayout from '../../../components/image-layout';
import WorkoutCard from '../../../components/workouts/workout-card';
import { increaseMuscle10kVariables, increaseMuscle15kVariables, increaseMuscle20kVariables, fatReduction10kVariables, fatReduction15kVariables, fatReduction20kVariables, keepingFit10kVariables, keepingFit15kVariables, keepingFit20kVariables } from '../../../data/workout-variables';
import { increaseMuscle10k, increaseMuscle15k, increaseMuscle20k, fatReduction10k, fatReduction15k, fatReduction20k, keepingFit10k, keepingFit15k, keepingFit20k } from '../../../data/workout-types';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import { addWorkout } from '../../../redux/actions/workouts';
import { showMessage } from 'react-native-flash-message';
import themeColors from '../../../styles/colors';

const Workout = ({ navigation }) => {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.authReducer.currentUser);
    const fitnessData = useSelector(state => state.healthReducer);
    const userWorkouts = useSelector(state => state.workoutsReducer.workouts);
    const todayCalories = useSelector(state => state.workoutsReducer.todayCalories);
    const totalPoint = useSelector(state => state.workoutsReducer.totalPoint);
    const Loading = useSelector(state => state.workoutsReducer.loading);

    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(moment());


    useEffect(() => {
        checkWorkouts();
        let groups = {};

        if (userWorkouts !== undefined && userWorkouts.length > 0) {
            userWorkouts.map(o => {
                const date = moment(o.date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                const isCompleted = o.completed;
                if (groups[date]) {
                    groups[date]['dots'].push({ color: isCompleted ? 'yellow' : 'gray' });
                } else {
                    groups[date] = { date: new Date(date), dots: [{ color: isCompleted ? 'yellow' : 'gray' }] };
                }
            });

            setmarkedDatesArray(Object.keys(groups).map(key => groups[key]));
        }
    }, [userWorkouts])

    const checkWorkouts = async () => {
        const userSelectedDays = profileData.days;
        const userHaveWorkoutToday = userSelectedDays.includes(moment().day());

        if (userHaveWorkoutToday) {
            const workout = userWorkouts.find(workout => workout.date === moment().format('DD-MM-YYYY'));
            const workoutExist = workout ? true : false;

            if (!workoutExist) {
                createWorkout();
            }
        }
    }

    function shuffle(array, number) {
        const cronicProblems = JSON.stringify(profileData.cronicProblems);

        var fieldsArr = cronicProblems
        var result = Object.values(array).filter(({ notfor }) =>
            notfor !== undefined && notfor.some(v => fieldsArr.includes(v))
        );

        let filteredArray = array.filter(val => !result.includes(val));

        let currentIndex = filteredArray.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [filteredArray[currentIndex], filteredArray[randomIndex]] = [
                filteredArray[randomIndex], filteredArray[currentIndex]];
        }

        return filteredArray.length > 0 ? filteredArray.slice(0, number) : filteredArray;
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
                newMoves.push(...staticMovesStart, ...otherMoves, ...staticMovesEnd);

                let description = "-"

                switch (profileData.values.target) {
                    case 1:
                        description = "Dizayn edilen bu antrenman programı mevcut kas kütlesi ve kuvvetin geliştirilmesini sağlamaktadır. Programlamada yer alan egzersizlerin sıralaması maksimum oranda kas kütlesi gelişiminin sağlanması için bir gün tamamen üst vücut egzersizlerinden oluşurken, diğer gün tamamen alt vücut egzersizlerinden oluşmaktadır.";
                        break;
                    case -1:
                        description = "Metabolik olarak daha hızlı ve daha ince bir görünüşe sahip olmak için dizayn edilen bu programda yağ oranınız azalırken aynı zamanda daha fonksiyonel ve fit bir fiziksel yapıya da sahip olacaksınız.";
                        break;
                    case 0:
                        description = "Daha sıkı ve atletik bir fiziksel görünüm kazanmanız için dizayn edilen bu antrenman programı, mevcut yağ oranınız düşmesini sağlarken, aynı zamanda da daha kuvvetli ve dayanıklı olmanızı sağlayacaktır.";
                        break;
                    default:
                        description = "";
                        break;
                }

                const point = Object.values(newMoves).reduce(function (prev, current) {
                    return prev + +parseFloat(current.type === "time" ? current.values.time / 10 : current.values.repeat) * parseFloat(current.values.set);
                }, 0)
                const kcal = Object.values(newMoves).reduce(function (prev, current) {
                    return prev + +parseFloat(current.values.calorie) * parseFloat(current.values.set);
                }, 0)
                const duration = Object.values(newMoves).reduce(function (prev, current) {
                    return prev + +parseFloat(current.videoData.duration) * parseFloat(current.values.set);
                }, 0)

                const workoutData = [{
                    description,
                    completed: false,
                    date: moment(SelectedDate).format('DD-MM-YYYY'),
                    duration,
                    kcal,
                    point,
                    type: profileData.values.target,
                    workout: newMoves
                }];

                dispatch(addWorkout(workoutData));
            })
            .catch(error => {
                dispatch({ type: 'ADD_WORKOUT_FAILED', errorMsg: error.message });
                Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyin.');
                console.log('promise error', error)
            })
    }

    const createWorkout = async () => {
        dispatch({ type: 'ADD_WORKOUT_START' });
        const gender = profileData.gender === "male" ? "Erkek" : "Kadin";

        const targetData = () => {
            if (profileData.values.target === 1 && totalPoint < 10000) return { variable: increaseMuscle10kVariables, data: increaseMuscle10k };
            if (profileData.values.target === 1 && totalPoint >= 10000 && totalPoint < 15000) return { variable: increaseMuscle15kVariables, data: increaseMuscle15k };
            if (profileData.values.target === 1 && totalPoint >= 15000) return { variable: increaseMuscle20kVariables, data: increaseMuscle20k };
            if (profileData.values.target === 0 && totalPoint < 10000) return { variable: keepingFit10kVariables, data: keepingFit10k };
            if (profileData.values.target === 0 && totalPoint >= 10000 && totalPoint < 15000) return { variable: keepingFit15kVariables, data: keepingFit15k };
            if (profileData.values.target === 0 && totalPoint >= 15000) return { variable: keepingFit20kVariables, data: keepingFit20k };
            if (profileData.values.target === -1 && totalPoint < 10000) return { variable: fatReduction10kVariables, data: fatReduction10k };
            if (profileData.values.target === -1 && totalPoint >= 10000 && totalPoint < 15000) return { variable: fatReduction15kVariables, data: fatReduction15k };
            if (profileData.values.target === -1 && totalPoint >= 15000) return { variable: fatReduction20kVariables, data: fatReduction20k };
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
                    dispatch({ type: 'ADD_WORKOUT_FAILED', errorMsg: error.message });
                    console.log('promise error', error)
                })
        } catch (error) {
            dispatch({ type: 'ADD_WORKOUT_FAILED', errorMsg: error.message });
            console.log('hata', error);
        }
    }

    const getSelectedDay = (day) => {
        const userSelectedDays = profileData.days;
        const userHaveWorkoutToday = userSelectedDays.includes(moment(day).day());
        if (userHaveWorkoutToday) {
            setSelectedDate(moment(day));
        } else {
            setSelectedDate(moment());
            showMessage({
                message: 'Antrenman yok.',
                description: 'Seçtiğiniz gün için antrenman programınız bulunmamaktadır. Ayarlardan antrenman günlerini değiştirebilirsiniz.',
                type: 'warning',
                backgroundColor: themeColors.yellow,
                color: themeColors.ultraDark,
                duration: 3000
            })
        }
    }


    return (
        <ImageLayout
            title="Antrenman"
            Loading={Loading}
            isScrollable={true}
        >
            {!Loading && userWorkouts !== undefined && userWorkouts.length > 0 &&
                <FlatList
                    style={{ flex: 1, paddingHorizontal: 20 }}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={userWorkouts.filter(q => q.date === moment(SelectedDate).format('DD-MM-YYYY'))}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => (
                        <>
                            <View style={{ width: '100%' }}>
                                <WorkoutChart
                                    days="Bugün"
                                    stepCount={fitnessData.steps[moment().day()] !== undefined && fitnessData.steps.length !== 0 ? parseFloat(fitnessData.steps[moment().day()].quantity).toFixed(0) : 0}
                                    calorieCount={parseFloat(todayCalories).toFixed(1)}
                                />
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <CalendarStrip
                                        scrollable={true}
                                        selectedDate={SelectedDate}
                                        maxDate={moment()}
                                        minDate={moment().subtract(1, 'week')}
                                        onDateSelected={(val) => getSelectedDay(val)}
                                        showMonth={true}
                                        innerStyle={{ flex: 1, marginTop: 10 }}
                                        style={{ width: Dimensions.get('window').width - 10, minHeight: 80 }}
                                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'yellow' }}
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
                                </View>
                            </View>
                            {!Loading &&
                                <Pressable
                                    onPress={createWorkout}
                                    style={styles.addButtonContainer}>
                                    <Icon name="add" color="#222" size={20} />
                                    <Text style={styles.addButtonText}
                                    >Yeni Antrenman Ekle</Text>
                                </Pressable>
                            }
                        </>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Seçili gün için antrenman yok.{'\n'} Daha fazla antrenman için antrenman günlerinizi ayarlardan değiştirebilirsiniz.</Text>
                        </View>
                    )}
                    renderItem={(workouts) => {
                        return (workouts.item &&
                            <WorkoutCard data={workouts} navigation={navigation} />
                        )
                    }}
                />
            }
        </ImageLayout>
    )
}

export default Workout;