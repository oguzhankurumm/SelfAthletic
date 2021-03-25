import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Switch } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { Card } from 'native-base';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { database2, auth2 } from '../../config/config';

const { height, width } = Dimensions.get("window");

const Settings = ({ navigation }) => {
    moment.locale('tr');

    const profileData = useSelector(state => state.user.users);
    const [Name, setName] = useState(profileData.name)
    const [Email, setEmail] = useState(auth2.currentUser.email)

    const [Water, setWater] = useState(profileData.settings.water);
    const [Food, setFood] = useState(profileData.settings.food);
    const [Workout, setWorkout] = useState(profileData.settings.workout);
    const [Target, setTarget] = useState(profileData.settings.target)

    const [Loading, setLoading] = useState(false);

    const setWaterFunc = (val) => {
        setWater(!Water)
        database2.ref('users').child(profileData.userId + '/settings/water').set(val)
    }

    const setWorkoutFunc = (val) => {
        setWorkout(!Workout)
        database2.ref('users').child(profileData.userId + '/settings/workout').set(val)
    }

    const setFoodFunc = (val) => {
        setFood(!Food)
        database2.ref('users').child(profileData.userId + '/settings/food').set(val)
    }

    const setTargetFunc = (val) => {
        setTarget(!Target)
        database2.ref('users').child(profileData.userId + '/settings/target').set(val)
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <KeyboardAwareView animated={true} style={{ flex: 1 }} >

                <SafeAreaView style={styles.container}>

                    <SpinnerLoading Loading={Loading} />

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Hesap Ayarları</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: 20 }}>
                        <Card style={{ borderRadius: 12, padding: 10 }}>

                            <View style={styles.registerItemProfile}>
                                <Icon name="person-outline" size={28} color="#2D2D2D" />
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="words"
                                    allowFontScaling={false}
                                    maxLength={80}
                                    placeholder="Ad Soyad"
                                    returnKeyType={"done"}
                                    value={Name}
                                    onChangeText={Name => setName(Name)}
                                />
                            </View>
                        </Card>

                        <Card style={{ borderRadius: 12, padding: 10 }}>
                            <View style={styles.registerItemProfile}>
                                <Icon name="mail-outline" size={28} color="#2D2D2D" />
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="E-Posta"
                                    returnKeyType={"done"}
                                    value={Email}
                                    onChangeText={email => setEmail(email)}
                                    keyboardType={"email-address"}
                                />
                            </View>
                        </Card>


                        <Card style={styles.textContainer}>
                            <Text style={styles.textStyleHeader}>Kayıt Tarihi</Text>
                            <Text style={styles.textStyle1}>{String(moment(profileData.registerDate, "DD/MM/YYYY HH:mm:ss").format("LL"))}</Text>
                        </Card>

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
                                onValueChange={(e) => setFood(e)}
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
                <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.bottomButton, { backgroundColor: '#000' }]}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#FFF',
                            marginRight: 5
                        }}>Vazgeç</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButton}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#000',
                            marginRight: 5
                        }}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
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
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
    },
    textStyle1: {
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
    },
    textContainer: {
        borderRadius: 12,
        padding: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

export default Settings
