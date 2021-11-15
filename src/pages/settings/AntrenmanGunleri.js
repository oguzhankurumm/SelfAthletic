import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { database, auth } from '../../config/config';

const { height, width } = Dimensions.get("window");

const AntrenmanGunleri = ({ navigation }) => {
    moment.locale('tr');

    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [WorkoutDays, setWorkoutDays] = useState([
        { value: 'Pazartesi', checked: false },
        { value: 'Salı', checked: false },
        { value: 'Çarşamba', checked: false },
        { value: 'Perşembe', checked: false },
        { value: 'Cuma', checked: false },
        { value: 'Cumartesi', checked: false },
        { value: 'Pazar', checked: false },
    ]);

    const onSave = () => {
        setLoading(true);
        var checkedList = WorkoutDays.filter(tg => tg.checked);
        if (checkedList.length === 0) {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Uyarı', 'Antrenman günü seçmelisiniz.');
            }, 200);
        } else {
            var selectedDays = [];
            checkedList.forEach((days) => {
                if (days.checked === true) {
                    selectedDays.push(days.value)
                }
            })
            database().ref('users').child(auth().currentUser.uid + '/workoutDays').set(selectedDays)
                .then(() => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Başarılı', 'Değişiklikler kaydedildi.')
                    }, 200);
                })
                .catch(() => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Değişiklikler kaydedilirken bir hata oluştu.')
                    }, 200);
                })
        }
    }


    const checkValues = () => {
        const newValue = WorkoutDays.map((checkbox, i) => {

            if (checkbox.value === profileData.workoutDays[0] || checkbox.value === profileData.workoutDays[1] || checkbox.value === profileData.workoutDays[2] || checkbox.value === profileData.workoutDays[3] || checkbox.value === profileData.workoutDays[4] || checkbox.value === profileData.workoutDays[5] || checkbox.value === profileData.workoutDays[6]) {
                const item = {
                    ...checkbox,
                    checked: !checkbox.checked,
                }
                return item
            }

            return checkbox
        })
        setWorkoutDays(newValue);
    }

    useEffect(() => {
        checkValues();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Antrenman Günleri</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Hangi günler antrenman yapmak istiyorsunuz?</Text>
                    {WorkoutDays.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    const options = WorkoutDays;

                                    options.forEach((newitem) => {
                                        if (newitem.checked === false) {
                                            newitem.checked === true
                                        }
                                    })

                                    var tempItem = item;
                                    tempItem.checked = !item.checked;
                                    const tempArr = [...WorkoutDays];
                                    setWorkoutDays(tempArr);
                                }}
                                key={index}
                                style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                            </TouchableOpacity>
                        )
                    })
                    }
                </View>

            </SafeAreaView>
            <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.bottomButton, { backgroundColor: '#000' }]}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        justifyContent: 'flex-start',
                        fontSize: 16,
                        color: '#FFF',
                        marginRight: 5
                    }}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSave()}
                    style={styles.bottomButton}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        justifyContent: 'flex-start',
                        fontSize: 16,
                        color: '#000',
                        marginRight: 5
                    }}>Kaydet</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    },
    bottomButton: {
        width: '50%',
        height: 60,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTextInput: {
        textAlign: 'center',
        width: '100%',
        padding: 20,
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
    },
    textStyleHeader: {
        width: '100%',
        marginBottom: 5,
        color: "#FFF",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
    },
    textContainer: {
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})

export default AntrenmanGunleri;