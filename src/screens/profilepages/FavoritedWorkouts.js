import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Sidebar from '../../components/Sidebar';
import { database } from '../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

const { height, width } = Dimensions.get("window");

const FavoritedWorkouts = ({ navigation }) => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);

    const [FavoritedList, setFavoritedList] = useState([]);

    const [ShowSideModal, setShowSideModal] = useState(false);
    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowSuccessAlert, setShowSuccessAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("")

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    const getFavorites = async () => {
        setLoading(true);
        var workoutList = [];

        await database().ref(`users/${userData.userId}/favorites/workouts`).once("value")
            .then((snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    snapshot.forEach((item) => {
                        console.log('date: ', item.val())
                        if (item.val().type === "wod") {
                            workoutList.push({
                                ...item.val(),
                                id: item.key
                            });
                        } else {
                            workoutList.push({
                                ...item.val(),
                                id: item.key
                            });
                        }
                        setFavoritedList(workoutList.sort((a, b) => b.date.localeCompare(a.date)))
                        setLoading(false);
                    })
                } else {
                    setFavoritedList([]);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setFavoritedList([]);
                setLoading(false);
                console.log('hata: ', err)
            })
    }

    useEffect(() => {
        getFavorites();
    }, [])

    const deleteFav = id => {
        database().ref(`users/${userData.userId}/favorites/workouts/`).child(id).remove()
            .then(() => {
                setFavoritedList(FavoritedList.filter(q => q.id !== id))
                setShowAlert(false);
                setTimeout(() => {
                    setShowSuccessAlert(true);
                }, 300);
            })
            .catch((err) => {
                console.log('err: ', err)
            })
    }

    const showWorkout = item => {
        navigation.navigate('AntrenmanList', { item: item, type: 1 })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Favori Antrenmanlarım</Text>
                    </TouchableOpacity>
                </View>

                <SCLAlert
                    onRequestClose={() => setShowAlert(false)}
                    theme="danger"
                    show={ShowAlert}
                    title="Favorilerden Kaldır"
                    subtitle="Antrenman favorilerden kaldırılsın mı?"
                >
                    <SCLAlertButton theme="danger" onPress={() => deleteFav(SelectedKey)}>Evet</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    onRequestClose={() => setShowSuccessAlert(false)}
                    theme="success"
                    show={ShowSuccessAlert}
                    title="Başarılı"
                    subtitle="Antrenman favorilerden kaldırıldı."
                >
                    <SCLAlertButton theme="success" onPress={() => setShowSuccessAlert(false)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                    {!Loading && FavoritedList.length >= 1 ?
                        <FlatList
                            style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={FavoritedList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                let point = 0;
                                var kcal = 0;
                                if (item.moves !== undefined) {

                                    Object.values(item.moves).forEach((wrk) => {
                                        if (wrk.type === "reps") {
                                            if (wrk.set && wrk.reps !== undefined) {
                                                point += parseFloat(wrk.set) * parseFloat(wrk.reps);
                                            }
                                            if (wrk.calorie !== undefined) {
                                                kcal += parseFloat(wrk.calorie);
                                            }
                                        } else {
                                            if (wrk.time !== undefined) {
                                                point += parseFloat(wrk.time) / parseFloat(10);
                                            }
                                            if (wrk.calorie !== undefined) {
                                                kcal += parseFloat(wrk.calorie);
                                            }
                                        }
                                    })
                                }
                                return (
                                    <View
                                        style={{
                                            backgroundColor: '#202026',
                                            padding: 15,
                                            marginBottom: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%',
                                            borderRadius: 18
                                        }}>

                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon2 size={32} color="#F1F1F1" name="dumbbell" />

                                                <View style={{ marginLeft: 20 }}>
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Bold',
                                                        fontSize: 14,
                                                        color: '#FFF'
                                                    }}>Favori Antrenman {index + 1}</Text>

                                                    <Text style={{
                                                        marginTop: 2,
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 11,
                                                        color: '#FFF'
                                                    }}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('lll')}</Text>

                                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                            <Icon name="star" color="#FFF" size={15} />
                                                            <Text style={{
                                                                marginLeft: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 11,
                                                                color: '#FFF'
                                                            }}>{String(point !== undefined && String(point) !== "NaN" ? point : 0)} puan</Text>
                                                        </View>

                                                        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                            <Icon name="directions-run" color="#FFF" size={15} />
                                                            <Text style={{
                                                                marginLeft: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 11,
                                                                color: '#FFF'
                                                            }}>{String(kcal !== undefined && String(kcal) !== "NaN" ? kcal : 0)} kcal</Text>
                                                        </View>

                                                    </View>

                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon2 onPress={() => {
                                                    let newObj = {
                                                        ...item,
                                                        kcal: kcal,
                                                        point: point
                                                    }
                                                    showWorkout(newObj)
                                                }} style={{ marginRight: 20 }} size={20} color="#F1F1F1" name="arrow-right" />
                                                <Icon2 onPress={() => {
                                                    setSelectedKey(item.id);
                                                    setShowAlert(!ShowAlert);
                                                }} size={20} color="#F1F1F1" name="minus-circle" />
                                            </View>

                                        </View>

                                    </View>
                                )
                            }}
                        />
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Favori antrenmanınız yok.</Text>
                        </View>
                    }
                </View>
            </SafeAreaView >
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
    circleHeaderText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 28,
        color: '#FFF'
    },
    targetHeader: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 22,
        color: '#FFF',
        marginBottom: 5
    },
    targetText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 20,
        color: '#FFF'
    },
    targetSubText: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF'
    },
})
export default FavoritedWorkouts;