import React, { useState, useEffect } from 'react'
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
    const [DefaultData, setDefaultData] = useState(props.route.params.data);
    const [Data, setData] = useState(props.route.params.data);
    const [Values, setValues] = useState(props.route.params.values);

    useEffect(() => {
        console.log({ Data })
    }, [])


    const CompleteTraining = async () => {
        setLoading(true);
        let totalPoint = 0;
        let totalKcal = 0;

        Object.values(Data).map(item => {
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
                workout: Data,
                completed: true,
                date,
                time: Values.initialTime,
                point: totalPoint,
                kcal: totalKcal
            }
            await firestore().collection('users').doc(profileData.userId).collection('workouts').add(workoutData);
            setLoading(false);
            dispatch(actions.fetchUserData(profileData.email));
            dispatch(healthActions.fetchHealth());
            props.navigation.navigate('WorkoutCompleted');
        } catch (error) {
            setLoading(false);
            Alert.alert('Hata', 'Bilgiler kaydedilirken bir sorun oluştu, lütfen tekrar deneyin.');
        }
    }

    return (
        <WorkoutLayout Loading={Loading}>
            <KeyboardAwareView animated={true} style={{ width: '100%', height: '100%' }} >
                <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }}>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,0,0.05)', padding: 10, borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="directions-run" color="#FFF" size={24} />
                            <Text style={styles.iconText}>{Values.TotalKcal} kalori</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="star" color="#FFF" size={24} />
                            <Text style={styles.iconText}>{Values.TotalPoint} puan</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="timer" color="#FFF" size={24} />
                            <Text style={styles.iconText}>{Values.initialTime} sn.</Text>
                        </View>
                    </View>

                    <FlatList
                        style={{ width: '100%', height: 'auto', marginTop: 15, marginBottom: 40 }}
                        scrollEnabled={true}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        data={Data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    style={styles.cardContainer}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 16,
                                            color: '#FFF',
                                            width: '100%'
                                        }}>{item.name}</Text>

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
                                                        if (Data[index].type === "reps") {
                                                            Data[index].values.repeat === text !== "" ? parseFloat(text) : parseFloat(item.values.repeat);
                                                        } else {
                                                            Data[index].values.time = text !== "" ? parseFloat(text) : parseFloat(item.values.time);
                                                        }
                                                    }}
                                                    keyboardType="number-pad"
                                                />

                                                <Text style={{
                                                    marginTop: 5,
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF'
                                                }}>{item.type !== 'time' ? String(DefaultData[index].values.repeat) + ' Tekrar' : String(DefaultData[index].values.time) + ' Saniye'}</Text>
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
                                                        Data[index].values.set = text !== "" ? parseFloat(text) : parseFloat(item.values.set);
                                                    }}
                                                    keyboardType="decimal-pad"
                                                />

                                                <Text style={{
                                                    marginTop: 5,
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF'
                                                }}>{String(DefaultData[index].values.set) + ' Set'}</Text>
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