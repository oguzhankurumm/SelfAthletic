import React, { useState, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Keyboard, Alert } from 'react-native';
import { Card } from 'native-base';
import Style from '../../styles/Style';
import Video from "react-native-video";
import SocialWrap from '../../components/SocialWrap';
import Logo from '../../img/self_logo_white.png';
import welcomeVideo from '../../video/welcome.mp4';
import Button2 from '../../components/Button';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { auth2, database2, f } from '../../config/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'native-base';
import moment from 'moment';
import axios from 'axios';
import { GoogleSignin } from '@react-native-community/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const Welcome = ({ navigation }) => {

    const { index, routes } = navigation.dangerouslyGetState();
    const currentRoute = routes[index].name;

    const [selectedType, setselectedType] = useState(0);

    const [Name, setName] = useState("");
    const [LoginEmail, setLoginEmail] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");
    const [RegisterEmail, setRegisterEmail] = useState("");
    const [RegisterPassword, setRegisterPassword] = useState("");
    const [ShowPassword, setShowPassword] = useState(true);

    const [Loading, setLoading] = useState(false);

    const epostaRTextInput = useRef(null);
    const parolaTextInput = useRef(null);
    const parolaRTextInput = useRef(null);


    const OnButtonClicked = async () => {
        Keyboard.dismiss()
        setLoading(true);
        await auth2.signInWithEmailAndPassword(LoginEmail, LoginPassword)
            .then((res) => LoginSuccess(res))
            .catch((err) => LoginFailed(err))
    }


    const LoginSuccess = (res) => {
        var checkInterval = null;

        checkInterval = setInterval(() => {
            if (res.user.uid !== null && currentRoute !== "Welcome") {
                clearInterval(checkInterval);
                setLoading(false);
            }
        }, 500)
    }

    const LoginFailed = (err) => {
        setLoading(false);

        if (err.code === "auth/user-not-found") {
            Alert.alert('Hata', 'Böyle bir kullanıcı yok.');
            return false;
        }

        if (err.code === "auth/wrong-password") {
            Alert.alert('Hata', 'Parolanız doğru değil.')
        }

        if (err.code !== "auth/wrong-password" && err.code !== "auth/user-not-found") {
            Alert.alert('Hata', String(err.message))
        }

    }

    const RegisterFailed = (response) => {
        setLoading(false);

        if (String(response.data) === "Error: The email address is improperly formatted.") {
            setTimeout(() => {
                Alert.alert("Hata", "E-Posta adresi doğru görünmüyor.");
            }, 200);
        } else if (String(response.data) === "Error: The password must be a string with at least 6 characters.") {
            setTimeout(() => {
                Alert.alert("Hata", "Parola en az 6 karakterli olmalıdır.");
            }, 200);
        } else if (String(response.data) === "Error: The email address is already in use by another account.") {
            setTimeout(() => {
                Alert.alert("Hata", "Bu e-posta adresi daha önce kullanılmış.");
            }, 200);
        } else if (String(response.data) === "auth/invalid-password") {
            setTimeout(() => {
                Alert.alert("Hata", "Parolanız en az 6 haneli olmalıdır.");
            }, 200);
        } else {
            setTimeout(() => {
                Alert.alert("Hata", String(response.data));
            }, 200);
        }
    }

    const onRegisterButtonClicked = async () => {

        Keyboard.dismiss()
        setLoading(true);

        const data = {
            avatar: "",
            birthdate: "01/01/1990",
            name: Name,
            email: RegisterEmail,
            gender: "Erkek",
            height: 170,
            weight: 60,
            usedFreePremium: false,
            registerDate: moment().format('DD-MM-YYYYTHH:mm:ss')
        }

        await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/createUser", { data: data, password: RegisterPassword })
            .then((res) => {
                if (res.status == 200) {
                    // var checkInterval = null;
                    // checkInterval = setInterval(() => {
                    //         if (currentRoute !== "Welcome") {
                    //             clearInterval(checkInterval);
                    setLoading(false);
                    setTimeout(() => {
                        navigation.navigate('Info', { userData: data, uid: res.data.userData.uid, password: RegisterPassword });
                    }, 200);
                    // }
                    // }, 500)

                } else {
                    setLoading(false);
                    RegisterFailed(res);
                }
            })
            .catch((err) => {
                setLoading(false);
                RegisterFailed(err);
            })

        // await auth2.createUserWithEmailAndPassword(RegisterEmail, RegisterPassword)
        //     .then(async (response) => {
        //         await database2.ref('users').child(response.user.uid).set(data)
        //             .then(async () => {
        //                 var checkInterval = null;

        //                 console.log('userid: ', response.user.uid)
        //                 checkInterval = setInterval(() => {
        //                     if (currentRoute !== "Welcome" && response.user.uid !== null && response.user.uid !== undefined) {
        //                         clearInterval(checkInterval);
        //                         setLoading(false);
        //                         navigation.navigate('Info', { userData: data, password: RegisterPassword });
        //                         navigation.dispatch(
        //                             CommonActions.reset({
        //                                 index: 1,
        //                                 routes: [
        //                                     {
        //                                         name: 'Info',
        //                                         params: {
        //                                             userData: data,
        //                                             password: RegisterPassword
        //                                         }
        //                                     }
        //                                 ],
        //                             })
        //                         );
        //                     }
        //                 }, 500)

        //             }).catch((err) => {
        //                 setLoading(false);
        //                 setTimeout(() => {
        //                     Alert.alert('Hata', String(err))
        //                 }, 200);
        //             })
        //     })
        //     .catch((err) => {
        //         RegisterFailed(err);
        //     })
    }

    const googleLogin = async () => {
        setLoading(true);
        try {
            // add any configuration settings here:
            await GoogleSignin.configure({
                webClientId:
                    '1053407049319-tapah6a7jmpk8v5cjk0trlsl6jg65lth.apps.googleusercontent.com',
            })

            const data = await GoogleSignin.signIn();

            // create a new firebase credential with the token
            const credential = f.auth.GoogleAuthProvider.credential(
                data.idToken,
                data.accessToken,
            );
            // login with credential
            const firebaseUserCredential = await f
                .auth()
                .signInWithCredential(credential)
                .then(async (res) => {
                    getData();

                    const profileData = res.additionalUserInfo;
                    const userData = res.user;

                    await database2.ref(`users/${userData.uid}`).once('value')
                        .then(async (res) => {
                            if (res.exists) {
                                setLoading(false);
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 1,
                                        routes: [
                                            {
                                                name: 'Info',
                                                params: {
                                                    userData: {
                                                        avatar: profileData.profile.picture,
                                                        birthdate: "01/01/1990",
                                                        gender: "Erkek",
                                                        email: profileData.profile.email,
                                                        name: profileData.profile.name,
                                                        usedFreePremium: false,
                                                        weight: 60,
                                                        height: 170,
                                                        registerDate: moment().format("DD-MM-YYYYTHH:mm:ss")
                                                    }
                                                }
                                            }
                                        ],
                                    })
                                );
                            } else {
                                await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", {
                                    uid: userData.uid,
                                    data: {
                                        avatar: profileData.profile.picture,
                                        birthdate: "01/01/1990",
                                        gender: "Erkek",
                                        email: profileData.profile.email,
                                        name: profileData.profile.name,
                                        usedFreePremium: false,
                                        weight: 60,
                                        height: 170,
                                        registerDate: moment().format("DD-MM-YYYYTHH:mm:ss")
                                    }
                                })
                                    .then((res) => {
                                        if (res.status === 200) {
                                            setLoading(false);
                                        } else {
                                            setLoading(false);
                                        }
                                    })
                            }
                        })
                })
                .catch((err) => {
                    setLoading(false);
                    console.log('hata: ', err)
                })


        } catch (e) {
            setLoading(false);
            console.error('e', e);
            getData();

        }
    }

    const getData = async () => {
        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_ACTIVITY_WRITE,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_BODY_WRITE,
            ],
        }
        const opt = {
            startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
            endDate: new Date().toISOString(), // required ISO8601Timestamp
            bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
            bucketInterval: 1, // optional - default 1. 
        };

        GoogleFit.getDailyStepCountSamples(opt)
            .then((res) => {
                console.log('Daily steps >>> ', res)
            })
            .catch((err) => { console.warn(err) });

        // shortcut functions, 
        // return weekly or daily steps of given date
        // all params are optional, using new Date() without given date, 
        // adjustment is 0 by default, determine the first day of week, 0 == Sunday, 1==Monday, etc.
        GoogleFit.getDailySteps(date).then(res => console.log('res: ', res)).catch(err => console.log('hatA: ', err))
        GoogleFit.getWeeklySteps(date, adjustment).then().catch()
    }

    return (
        <KeyboardAwareScrollView extraHeight={150} enableOnAndroid={true} style={{
            flex: 1, flexDirection: 'column', backgroundColor: '#FFF'
        }}>

            < StatusBar barStyle="light-content" />
            <SpinnerLoading Loading={Loading} />

            <Video
                source={welcomeVideo}
                style={styles.backgroundVideo}
                muted={true}
                repeat={true}
                resizeMode={"cover"}
                rate={1.0}
                ignoreSilentSwitch={"obey"}
            />

            <View style={{ height: height, width: width, backgroundColor: 'rgba(0,0,0,0.6)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

            <View style={styles.Wrapper}>
                <Image
                    source={Logo}
                    style={{
                        width: '100%',
                        height: 100,
                        resizeMode: 'contain'
                    }}
                />

                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ marginBottom: 10 }}>

                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>

                            <Button onPress={() => {
                                setselectedType(0);
                            }} full style={{ flexDirection: 'row', backgroundColor: selectedType === 0 ? "#FFF" : "#000", height: 40, width: '50%', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 15, color: selectedType === 0 ? "#000" : "#FFF", textAlign: 'center' }}>Giriş Yap</Text>
                            </Button>

                            <Button onPress={() => {
                                setselectedType(1);
                            }} full style={{ flexDirection: 'row', backgroundColor: selectedType === 1 ? "#FFF" : "#000", height: 40, width: '50%', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 15, color: selectedType === 1 ? "#000" : "#FFF", textAlign: 'center' }}>Kayıt Ol</Text>
                            </Button>
                        </View>
                    </View>

                    {selectedType === 0 ?
                        <Card style={{ borderRadius: 12, padding: 10, width: '100%' }}>

                            <View style={styles.registerItemProfile}>
                                <Icon name="mail-outline" size={28} color="#2D2D2D" />
                                <Input
                                    onSubmitEditing={() => parolaTextInput.current.focus()}
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="E-Posta"
                                    returnKeyType={"next"}
                                    value={LoginEmail}
                                    onChangeText={email => setLoginEmail(email)}
                                    keyboardType={"email-address"}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 0.5, backgroundColor: '#4D4D4D' }} />
                            </View>

                            <View style={styles.registerItemProfile}>
                                <Icon name="lock-outline" size={28} color="#2D2D2D" />
                                <Input
                                    inputRef={parolaTextInput}
                                    style={styles.registerTextInput}
                                    allowFontScaling={false}
                                    blurOnSubmit={true}
                                    maxLength={30}
                                    placeholder="Parola"
                                    returnKeyType={"done"}
                                    autoCapitalize="none"
                                    secureTextEntry={ShowPassword}
                                    value={LoginPassword}
                                    onChangeText={password => setLoginPassword(password)}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: -20, top: 15, paddingRight: 30 }} onPress={() => setShowPassword(!ShowPassword)}>
                                    <Icon name="remove-red-eye" size={25} color={'#2D2D2D'} />
                                </TouchableOpacity>
                            </View>

                        </Card>

                        :
                        <>
                            <Card style={{ borderRadius: 12, padding: 10, width: '100%' }}>

                                <View style={styles.registerItemProfile}>
                                    <Icon name="person-outline" size={28} color="#2D2D2D" />
                                    <Input
                                        onSubmitEditing={() => epostaRTextInput.current.focus()}
                                        blurOnSubmit={false}
                                        style={styles.registerTextInput}
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        allowFontScaling={false}
                                        maxLength={80}
                                        placeholder="Ad Soyad"
                                        returnKeyType={"next"}
                                        value={Name}
                                        onChangeText={Name => setName(Name)}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1, height: 0.5, backgroundColor: '#4D4D4D' }} />
                                </View>

                                <View style={styles.registerItemProfile}>
                                    <Icon name="mail-outline" size={28} color="#2D2D2D" />
                                    <Input
                                        inputRef={epostaRTextInput}
                                        onSubmitEditing={() => parolaRTextInput.current.focus()}
                                        style={styles.registerTextInput}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        allowFontScaling={false}
                                        maxLength={100}
                                        placeholder="E-Posta"
                                        returnKeyType={"next"}
                                        value={RegisterEmail}
                                        onChangeText={email => setRegisterEmail(email)}
                                        keyboardType={"email-address"}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1, height: 0.5, backgroundColor: '#4D4D4D' }} />
                                </View>

                                <View style={styles.registerItemProfile}>
                                    <Icon name="lock-outline" size={28} color="#2D2D2D" />
                                    <Input
                                        inputRef={parolaRTextInput}
                                        style={styles.registerTextInput}
                                        allowFontScaling={false}
                                        blurOnSubmit={true}
                                        maxLength={30}
                                        placeholder="Parola"
                                        returnKeyType={"done"}
                                        autoCapitalize="none"
                                        secureTextEntry={ShowPassword}
                                        value={RegisterPassword}
                                        onChangeText={password => setRegisterPassword(password)}
                                    />
                                    <TouchableOpacity style={{ position: 'absolute', right: -20, top: 15, paddingRight: 30 }} onPress={() => setShowPassword(!ShowPassword)}>
                                        <Icon name="remove-red-eye" size={25} color={'#2D2D2D'} />
                                    </TouchableOpacity>
                                </View>

                            </Card>
                        </>

                    }

                    {selectedType === 0 ?
                        <View style={Style.registerItemProfile}>
                            <Button2
                                title="Giriş Yap"
                                onPress={() => OnButtonClicked()}
                                style={{
                                    padding: 8,
                                    color: '#000',
                                    backgroundColor: '#FFF',
                                    fontWeight: '700'
                                }}
                            />
                        </View>
                        :
                        <View style={Style.registerItemProfile}>
                            <Button2
                                title="Kayıt Ol"
                                onPress={() => onRegisterButtonClicked()}
                                style={{
                                    padding: 8,
                                    color: '#000',
                                    backgroundColor: '#FFF',
                                    fontWeight: '700'
                                }}
                            />
                        </View>
                    }

                </View>


                <View style={styles.ButtonWrapper}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40 }}>
                        <SocialWrap onPress={googleLogin} title="Google İle Giriş Yap" textStyle={styles.socialText} style={[styles.Socials, { backgroundColor: '#FFF' }]} icon="google" iconcolor="#4C8BF5" />
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={Style.WelcomeSignIn}>Şifremi Unuttum</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </KeyboardAwareScrollView >

    )
}

const styles = StyleSheet.create({
    backgroundVideo: {
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0
    },
    Wrapper: {
        height: height,
        width: width,
        justifyContent: 'space-between',
        paddingVertical: 70,
        paddingHorizontal: 20,
        alignItems: 'center',
        flexDirection: 'column'
    },
    ButtonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Socials: {
        height: 50,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 12
    },
    registerTextInput: {
        width: '85%',
        padding: 10,
        color: "#2d2d2d",
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
    },
    socialText: {
        fontFamily: "SFProDisplay-Medium",
        marginLeft: 5,
        color: "#4D4D4D",
        fontSize: 16,
    },
    registerItemProfile: {
        // width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})
export default Welcome;
