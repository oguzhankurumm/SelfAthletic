import React, { useState } from 'react'
import { View, Text, Pressable, FlatList, TextInput, Alert } from 'react-native';
import { firestore } from '../../../config/config';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import WorkoutLayout from '../../../components/workout-layout';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import styles from './style';
import * as actions from '../../../redux/actions/auth';
import * as healthActions from '../../../redux/actions/health';

const EndWorkout = (props) => {
    const dispatch = useDispatch()
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [Data, setData] = useState(props.route.params.data);
    const [DefaultData, setDefaultData] = useState(props.route.params.workouts);
    const [Workouts, setWorkouts] = useState(props.route.params.workouts);
    const [Values, setValues] = useState(props.route.params.values);

    console.log({ Data, Workouts })
    const CompleteTraining = async () => {
        setLoading(true);
        let totalPoint = 0;
        let totalKcal = 0;

        Object.values(Workouts).map(item => {
            if (item.type === "time") {
                const timePoint = parseFloat(item.values.time) * parseFloat(item.values.set) / 10;
                totalPoint = parseFloat(totalPoint) + parseFloat(timePoint);
                totalKcal = parseFloat(totalKcal) + parseFloat(item.values.time / 10 * item.values.set);
            } else {
                const repeatPoint = parseFloat(item.values.set);
                totalPoint = parseFloat(totalPoint) + repeatPoint;
                totalKcal = parseFloat(totalKcal) + parseFloat(item.values.repeat * item.values.set);
            }
        })

        try {
            const date = moment().format("DD-MM-YYYY");
            const workoutData = {
                completed: true,
                date,
                description: Data.description,
                duration: Values.initialTime,
                time: Values.initialTime,
                kcal: totalKcal,
                point: totalPoint,
                type: profileData.values.target,
                workout: Workouts,
            }
            await firestore().collection('users').doc(profileData.userId).collection('workouts').doc(Data.id).update(workoutData);
            setLoading(false);
            props.navigation.navigate('WorkoutCompleted');
        } catch (error) {
            setLoading(false);
            Alert.alert('Hata', 'Bilgiler kaydedilirken bir sorun oluştu, lütfen tekrar deneyin.');
        }
    }

    const IconsCard = ({ iconName, value, valueName }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Icon name={iconName} color="#FFF" size={24} />
            <Text style={styles.iconText}>{value} {valueName}</Text>
        </View>
    )

    return (
        <WorkoutLayout Loading={Loading}>
            <KeyboardAwareView animated={true} style={{ width: '100%', height: '100%' }} >
                <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }}>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,0,0.05)', padding: 10, borderRadius: 12 }}>
                        <IconsCard iconName="directions-run" value={Values.TotalKcal} valueName="kalori" />
                        <IconsCard iconName="star" value={Values.TotalPoint} valueName="puan" />
                        <IconsCard iconName="timer" value={Values.initialTime} valueName="sn." />
                    </View>

                    <FlatList
                        style={{ width: '100%', height: 'auto', marginTop: 15, marginBottom: 40 }}
                        scrollEnabled={true}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        data={Workouts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    style={styles.cardContainer}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.nameText}>{item.name}</Text>

                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '100%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                                <TextInput
                                                    style={styles.textInput}
                                                    textAlign="center"
                                                    placeholderTextColor="#FFF"
                                                    autoCorrect={false}
                                                    autoCapitalize="none"
                                                    allowFontScaling={false}
                                                    maxLength={2}
                                                    placeholder={item.type !== 'reps' ? String(item.values.time) : String(item.values.repeat)}
                                                    returnKeyType={"done"}
                                                    onChangeText={(text) => {
                                                        if (Workouts[index].type === "reps") {
                                                            Workouts[index].values.repeat === text !== "" ? parseFloat(text) : parseFloat(item.values.repeat);
                                                        } else {
                                                            Workouts[index].values.time = text !== "" ? parseFloat(text) : parseFloat(item.values.time);
                                                        }
                                                    }}
                                                    keyboardType="number-pad"
                                                />

                                                <Text style={styles.typeText}>{item.type !== 'time' ? String(DefaultData[index].values.repeat) + ' Tekrar' : String(DefaultData[index].values.time) + ' Saniye'}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                                <TextInput
                                                    style={styles.textInput}
                                                    textAlign="center"
                                                    placeholderTextColor="#FFF"
                                                    autoCorrect={false}
                                                    autoCapitalize="none"
                                                    allowFontScaling={false}
                                                    maxLength={2}
                                                    placeholder={String(item.values.set)}
                                                    returnKeyType={"done"}
                                                    onChangeText={text => {
                                                        Workouts[index].values.set = text !== "" ? parseFloat(text) : parseFloat(item.values.set);
                                                    }}
                                                    keyboardType="decimal-pad"
                                                />

                                                <Text style={styles.typeText}>{String(DefaultData[index].values.set) + ' Set'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}

                    />
                </View>

                <Pressable
                    style={styles.bottomButton}
                    onPress={CompleteTraining}>
                    <Text style={styles.textStyle}>Bilgileri Onayla</Text>
                </Pressable>

            </KeyboardAwareView>
        </WorkoutLayout>
    )
}

export default EndWorkout;