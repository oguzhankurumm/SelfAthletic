import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, Dimensions, ScrollView, Alert, TouchableOpacity, ImageBackground, TouchableHighlight, NativeEventEmitter, NativeModules } from 'react-native';
// import Slider from '../../components/Slider';
import LinearGradient from 'react-native-linear-gradient';
import { database2, auth2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import StepcounterIosAndroid from "react-native-stepcounter-ios-android";
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';


const { height, width } = Dimensions.get("window");

const Home = ({ props, navigation }) => {
    const profileData = useSelector(state => state.user.users);
    const [ShowSideModal, setShowSideModal] = useState(false);

    const [Loading, setLoading] = useState(false);
    const [Campaigns, setCampaigns] = useState([]);
    const [Workouts, setWorkouts] = useState([]);
    const [Calories, setCalories] = useState(0);
    const [CaloriesChart, setCaloriesChart] = useState(0)
    const [Steps, setSteps] = useState(0);
    const [StepChart, setStepChart] = useState(0);
    const [ShowAlert, setShowAlert] = useState(false);

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    useLayoutEffect(() => {
        getMyCalories();
        // getMySteps();
        getWorkouts();
        getCampaings();

        if (profileData.questions.target === undefined || profileData.questions.nutrition === undefined) {
            setTimeout(() => {
                setShowAlert(true);
            }, 1000);
        }
    }, [])

    useEffect(() => {
        StepcounterIosAndroid.isSupported()
            .then((result) => {
                if (result) {
                    console.log('Sensor TYPE_STEP_COUNTER is supported on this device');

                    const myModuleEvt = new NativeEventEmitter(
                        NativeModules.StepcounterIosAndroid
                    );
                    myModuleEvt.addListener('StepCounter', (data) => {
                        console.log('STEPS', data.steps);
                        setSteps(data.steps);
                    });

                    StepcounterIosAndroid.startStepCounter();
                } else {
                    console.log(
                        'Sensor TYPE_STEP_COUNTER is not supported on this device'
                    );
                }
            })
            .catch((err) => console.log(err));

        return () => StepcounterIosAndroid.stopStepCounter();
    }, [])

    const getMyCalories = async () => {

        let CalorieList = [];
        database2.ref('users_points/' + profileData.userId).on('value', snapshot => {
            if (snapshot.val() !== null && snapshot.val() !== undefined) {
                snapshot.forEach((item) => {
                    CalorieList.push(item.val());
                })

                let sum = CalorieList.reduce(function (prev, current) {
                    return prev + +parseFloat(current.calories)
                }, 0);

                setCalories(sum);
                setCaloriesChart(parseFloat(profileData.targets?.calorie !== undefined ? parseFloat(profileData.targets.calorie) / parseFloat(sum) : 0).toFixed(2))
            } else {
                setCalories(0);
            }
        })
    }

    const SCLModal = ({ title, subtitle, onPress1, onPress1Title, onPress1Style, onPress2, onPress2Title, onPress2Style }) => {
        return (
            <SCLAlert
                cancellable={false}
                theme="warning"
                show={ShowAlert}
                onRequestClose={() => setShowAlert(false)}
                title={title}
                subtitle={subtitle}
            >
                <SCLAlertButton theme={onPress1Style} onPress={onPress1}>{onPress1Title}</SCLAlertButton>
                {onPress2 !== undefined &&
                    <SCLAlertButton theme={onPress2Style} onPress={onPress2}>{onPress2Title}</SCLAlertButton>
                }
            </SCLAlert>
        )
    }

    // const getMySteps = () => {
    //     let StepList = [];
    //     database2.ref('steps' + profileData.userId).on('value', snapshot => {
    //         if (snapshot.val() !== null && snapshot.val() !== undefined) {
    //             snapshot.forEach((item) => {
    //                 StepList.push(item.val());
    //             })

    //             let sum = StepList.reduce(function (prev, current) {
    //                 return prev + +parseFloat(current.steps)
    //             }, 0);
    //             setSteps(sum !== 'NaN' ? sum : 0);
    //             setStepChart(parseFloat(profileData.targets?.step !== undefined && parseFloat(profileData.targets.step) / parseFloat(sum)).toFixed(0))
    //         } else {
    //             setSteps(0);
    //         }
    //     })
    // }

    const getCampaings = () => {
        database2.ref('campaigns').once("value")
            .then((item) => {
                let campList = []
                item.forEach((item) => {
                    campList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setCampaigns(campList)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setWorkouts(null)
            })
    }

    const getWorkouts = () => {
        database2.ref('workouts_wod').once("value")
            .then((item) => {
                let workoutList = []
                item.forEach((item) => {
                    workoutList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setWorkouts(workoutList.sort((a, b) => a.title.localeCompare(b.title)));
                setLoading(false);
            })
            .catch((err) => {
                setWorkouts(null)
                setLoading(false);
            })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />

                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSideModal(!ShowSideModal)}>
                            <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Ana Sayfa</Text>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Notifications')}>
                            <Icon name="notifications" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <SCLModal
                    title="Bazı Bilgiler Eksik"
                    subtitle="Bilgiler doldurulmamış, şimdi doldurmak ister misiniz?"
                    onPress1={() => {
                        setShowAlert(false);
                        navigation.navigate("Info");
                    }}
                    onPress1Title="Hemen Düzenle"
                    onPress1Style="warning"
                />

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        {!Loading && Campaigns.map((item, index) => {
                            return (
                                <TouchableOpacity key={item.id} onPress={() => navigation.navigate('SliderDetails', { item: item })} style={{ width: '100%', height: 200, borderRadius: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: item.image }}
                                        style={{ width: '100%', height: 200, borderRadius: 18 }}
                                    />

                                    <LinearGradient
                                        start={{ x: 1, y: 1 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['rgba(0,0,0,0.9)', 'transparent']}
                                        style={{
                                            position: 'absolute',
                                            borderRadius: 18,
                                            width: '100%',
                                            height: 200
                                        }}
                                    />

                                    <View style={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
                                        <Text numberOfLines={2} style={{ fontFamily: 'SFProDisplay-Bold', fontSize: 20, color: '#FFF', marginBottom: 8 }}>{item.title}</Text>
                                        <Text numberOfLines={2} style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 13, color: '#FFF' }}>{item.description}</Text>
                                    </View>

                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>

                            <Text style={styles.titleStyle}>Antrenmanlar</Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('WorkoutList', { Workouts: Workouts })}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.subTitleStyle}>Tümünü Gör</Text>
                                <Icon name="keyboard-arrow-right" size={18} color="yellow" />
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{ width: '100%', height: 150, marginTop: 20 }}
                        >
                            {!Loading && Workouts.map((item, index) => {
                                return (
                                    <TouchableOpacity key={item.id} onPress={() => navigation.navigate('WorkoutDetails', { item: item })}
                                        style={{
                                            height: 'auto',
                                            width: width / 1.6,
                                            marginRight: 15,
                                            borderRadius: 18
                                        }}>
                                        <Image
                                            resizeMode="cover"
                                            source={{ uri: item.image }}
                                            style={{
                                                width: '100%',
                                                height: 150,
                                                borderRadius: 18
                                            }}
                                        />
                                        <LinearGradient
                                            start={{ x: 1, y: 1 }}
                                            end={{ x: 1, y: 1 }}
                                            colors={['rgba(0,0,0,0.6)', 'transparent']}
                                            style={{
                                                position: 'absolute',
                                                borderRadius: 18,
                                                width: '100%',
                                                height: 150
                                            }}
                                        />
                                        <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                                fontSize: 20,
                                                color: '#FFF',
                                                marginBottom: 8
                                            }}>{item.title}</Text>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            position: 'absolute',
                                            paddingHorizontal: 20,
                                            justifyContent: 'space-between',
                                            bottom: 15
                                        }}>

                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 10
                                            }}>
                                                <Icon name="star" color="#FFF" size={20} />
                                                <Text numberOfLines={2} style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 13,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>{String(parseFloat(item.point))} Puan</Text>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="directions-run" color="#FFF" size={20} />
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>{String(parseFloat(item.calories))} Kalori</Text>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, width: '100%', height: 150, marginTop: 50 }}>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Calories')}
                            style={{ justifyContent: 'center', alignItems: 'center', width: '48%' }}>
                            <AnimatedCircularProgress
                                size={150}
                                width={6}
                                rotation={90}
                                fill={String(CaloriesChart) !== undefined && String(CaloriesChart) !== "NaN" && String(CaloriesChart) !== "Infinity" ? CaloriesChart : 0}
                                tintColor="#376F19"
                                backgroundColor="#2d2d2d">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.headerText, { fontSize: 24, marginBottom: 5 }]}>{String(fill) !== "NaN" ? fill : 0}</Text>
                                        <Text style={styles.headerText}>Kalori</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => navigation.navigate('StepCounter')}
                            style={{ justifyContent: 'center', alignItems: 'center', width: '48%' }}>
                            <AnimatedCircularProgress
                                size={150}
                                width={6}
                                rotation={90}
                                fill={StepChart}
                                tintColor="#d1dc26"
                                backgroundColor="#2d2d2d">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.headerText, { fontSize: 24, marginBottom: 5 }]}>{Steps}</Text>
                                        <Text style={styles.headerText}>Adım</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: height
    },
    titleStyle: {
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 22,
        color: '#FFF'
    },
    subTitleStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        fontSize: 16,
        color: 'yellow'
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
    headerSubText: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#FFF'
    }
})
export default Home;