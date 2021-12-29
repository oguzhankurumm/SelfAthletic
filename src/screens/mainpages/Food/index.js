import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Alert, Pressable, Dimensions } from 'react-native';
import { firestore } from '../../../config/config';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/tr';
import CalendarStrip from 'react-native-calendar-strip';
import WorkoutCard from '../../../components/workouts/workout-card';
import { increaseMuscle10kVariables, increaseMuscle15kVariables, increaseMuscle20kVariables, fatReduction10kVariables, fatReduction15kVariables, fatReduction20kVariables, keepingFit10kVariables, keepingFit15kVariables, keepingFit20kVariables } from '../../../data/workout-variables';
import { increaseMuscle10k, increaseMuscle15k, increaseMuscle20k, fatReduction10k, fatReduction15k, fatReduction20k, keepingFit10k, keepingFit15k, keepingFit20k } from '../../../data/workout-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import { addWorkout } from '../../../redux/actions/workouts';
import { showMessage } from 'react-native-flash-message';
import themeColors from '../../../styles/colors';
import FoodListCard from '../../../components/food/food-list';
import FoodCharts from '../../../components/food/food-chart';
import FoodLayout from '../../../components/food-layout';

const Food = ({ navigation }) => {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.authReducer.currentUser);
    const fitnessData = useSelector(state => state.healthReducer);
    const userWorkouts = useSelector(state => state.workoutsReducer.workouts);
    const todayCalories = useSelector(state => state.workoutsReducer.todayCalories);
    // const Loading = useSelector(state => state.workoutsReducer.loading);
    const [Loading, setLoading] = useState(true);
    const [FoodList, setFoodList] = useState([]);

    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(moment());


    const getSelectedDay = (day) => {
        const userSelectedDays = profileData.days;
        const userHaveWorkoutToday = userSelectedDays.includes(moment(day).day());
        if (userHaveWorkoutToday) {
            setSelectedDate(moment(day));
        } else {
            setSelectedDate(moment());
            showMessage({
                message: 'Program yok.',
                description: 'Seçtiğiniz gün için beslenme programınız bulunmamaktadır.',
                type: 'warning',
                backgroundColor: themeColors.yellow,
                color: themeColors.ultraDark,
                duration: 3000
            })
        }
    }

    const getFoods = async () => {
        setLoading(true);
        const foodRes = await firestore().collection('foods')
            .where('category', 'array-contains', 'Ana')
            .where('besinEYP', '>=', 7)
            .get();
        const docs = foodRes.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
        setFoodList(docs);
        setLoading(false);
        console.log('docs:', docs)
    }

    useEffect(() => {
        getFoods();
    }, [])


    return (
        <FoodLayout
            title="Beslenme"
            Loading={Loading}
            isScrollable={true}
        >


            <FoodCharts />
            {!Loading && FoodList.length > 0 &&
                <FoodListCard
                    data={FoodList.slice(0, 10).sort((a, b) => a.name.localeCompare(b.name))}
                    title="Kahvaltı"
                />
            }

            {/* {!Loading && userWorkouts !== undefined && userWorkouts.length > 0 &&
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
            } */}
        </FoodLayout>
    )
}

export default Food;