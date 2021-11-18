import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Switch } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { Card } from 'native-base';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { database } from '../../config/config';

const { height, width } = Dimensions.get("window");

const BildirimAyarlari = ({ navigation }) => {
    moment.locale('tr');

    const profileData = useSelector(state => state.authReducer.currentUser);

    const [Water, setWater] = useState(profileData.settings?.water !== undefined ? profileData.settings.water : false);
    const [Food, setFood] = useState(profileData.settings?.food !== undefined ? profileData.settings.food : false);
    const [Workout, setWorkout] = useState(profileData.settings?.workout !== undefined ? profileData.settings.workout : false);
    const [Target, setTarget] = useState(profileData.settings?.target !== undefined ? profileData.settings.target : false)

    const [Loading, setLoading] = useState(false);

    const setWaterFunc = (val) => {
        setWater(!Water)
        database().ref('users').child(profileData.userId + '/settings/water').set(val)
    }

    const setWorkoutFunc = (val) => {
        setWorkout(!Workout)
        database().ref('users').child(profileData.userId + '/settings/workout').set(val)
    }

    const setFoodFunc = (val) => {
        setFood(!Food)
        database().ref('users').child(profileData.userId + '/settings/food').set(val)
    }

    const setTargetFunc = (val) => {
        setTarget(!Target)
        database().ref('users').child(profileData.userId + '/settings/target').set(val)
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <KeyboardAwareView animated={true} style={{ flex: 1 }} >

                <SafeAreaView style={styles.container}>

                    <SpinnerLoading Loading={Loading} />

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Bildirim Ayarları</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 }}>
                        <Card style={styles.textContainer}>
                            <Text style={styles.textStyleHeader}>Su Hatırlatması</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "yellow" }}
                                thumbColor={Water == true ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(e) => setWaterFunc(e)}
                                value={Water}
                            />
                        </Card>

                        <Card style={styles.textContainer}>
                            <Text style={styles.textStyleHeader}>Antrenman Hatırlatması</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "yellow" }}
                                thumbColor={Workout == true ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(e) => setWorkoutFunc(e)}
                                value={Workout}
                            />
                        </Card>

                        <Card style={styles.textContainer}>
                            <Text style={styles.textStyleHeader}>Öğün Hatırlatması</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "yellow" }}
                                thumbColor={Food == true ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(e) => setFoodFunc(e)}
                                value={Food}
                            />
                        </Card>

                        <Card style={styles.textContainer}>
                            <Text style={styles.textStyleHeader}>Günlük Hedef Hatırlatması</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "yellow" }}
                                thumbColor={Target == true ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(e) => setTargetFunc(e)}
                                value={Target}
                            />
                        </Card>

                    </View>

                </SafeAreaView>
            </KeyboardAwareView>
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
        color: '#FFF'
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
        width: '85%',
        padding: 10,
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
    },
    registerItemProfile: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    textStyleHeader: {
        color: "#FFF",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
    },
    textStyle1: {
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
    },
    textContainer: {
        backgroundColor: '#202026',
        borderColor: '#202026',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

export default BildirimAyarlari;
