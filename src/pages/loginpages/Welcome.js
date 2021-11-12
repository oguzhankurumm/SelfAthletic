import React, { useState, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Keyboard, Alert } from 'react-native';
import { Card } from 'native-base';
import Style from '../../styles/Style';
import Video from "react-native-video";
import Logo from '../../img/self_logo_white.png';
import welcomeVideo from '../../video/welcome.mp4';
import Button2 from '../../components/Button';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { auth, database, firestore } from '../../config/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'native-base';
import moment from 'moment';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const { width, height } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
    const [selectedType, setselectedType] = useState(0);

    const [Name, setName] = useState("");
    const [LoginEmail, setLoginEmail] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");
    const [RegisterEmail, setRegisterEmail] = useState("");
    const [RegisterPassword, setRegisterPassword] = useState("");
    const [ShowPassword, setShowPassword] = useState(true);
    const [Username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("SelfAthletic")
    const [lastName, setLastName] = useState("App")

    const [Loading, setLoading] = useState(false);

    const epostaRTextInput = useRef(null);
    const usernameRTextInput = useRef(null);
    const parolaTextInput = useRef(null);
    const parolaRTextInput = useRef(null);


    const OnLoginButtonClicked = async () => {
        Keyboard.dismiss()
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(LoginEmail, LoginPassword);
            setLoading(false);
        } catch (error) {
            LoginFailed(err);
        }
    }

    const onRegisterButtonClicked = async () => {
        Keyboard.dismiss()
        setLoading(true);

        const data = {
            profile_picture: 'https://is2-ssl.mzstatic.com/image/thumb/Purple125/v4/a3/52/8d/a3528db2-79ea-7709-b874-025aafe0db6e/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/600x600wa.png',
            birthdate: "01-01-1990",
            firstName: firstName,
            lastName: lastName,
            gender: "male",
            values: {
                height: 170,
                weight: 60,
            },
            usedFreePremium: false,
            registerDate: moment().format('DD-MM-YYYYTHH:mm:ss')
        }

        try {
            const authUser = await auth().createUserWithEmailAndPassword(RegisterEmail, RegisterPassword);
            await authUser.user.updateProfile({
                displayName: firstName + ' ' + lastName
            })
            firestore().collection('users')
                .doc(authUser.user.email)
                .set({
                    ...data,
                    owner_uid: authUser.user.uid,
                    username: String(Username).toLowerCase(),
                    email: authUser.user.email,
                })

        } catch (error) {
            console.log('register error', error)
            RegisterFailed(error);
        } finally {
            await auth().signOut();
            setLoading(false);
            navigation.push('Info');
        }
    }

    const LoginFailed = (err) => {
        setLoading(false);
        switch (err.code) {
            case "auth/user-not-found":
                showMessage({
                    message: "Kullanıcı Bulunamadı",
                    description: 'Bu e-posta adresi ile sisteme kayıtlı kullanıcı bulunamadı.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            case "auth/wrong-password":
                showMessage({
                    message: "Hatalı Parola",
                    description: 'Parolanız doğru görünmüyor.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            case "auth/invalid-email":
                showMessage({
                    message: "Hatalı E-Posta",
                    description: 'E-posta adresi doğru görünmüyor.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            default:
                showMessage({
                    message: "Hata!",
                    description: String(err.message),
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
        }
    }

    const RegisterFailed = (response) => {
        setLoading(false);

        switch (response.data) {
            case "Error: The email address is improperly formatted.":
                showMessage({
                    message: "Hata!",
                    description: 'E-posta adresi doğru görünmüyor.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            case "Error: The password must be a string with at least 6 characters.":
                showMessage({
                    message: "Hata!",
                    description: 'Parola en az 6 karakterli olmalıdır."',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                }); v
                break;
            case "Error: The email address is already in use by another account.":
                showMessage({
                    message: "Hata!",
                    description: 'Bu e-posta adresi daha önce kullanılmış.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            case "auth/invalid-password":
                showMessage({
                    message: "Hata!",
                    description: 'Parolanız en az 6 haneli olmalıdır.',
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
            default:
                showMessage({
                    message: "Hata!",
                    description: String(response.data),
                    type: "danger",
                    icon: "danger",
                    hideStatusBar: true
                });
                break;
        }
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
                                    placeholderTextColor="#999"
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
                                    placeholderTextColor="#999"
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
                                        onSubmitEditing={() => usernameRTextInput.current.focus()}
                                        blurOnSubmit={false}
                                        style={styles.registerTextInput}
                                        autoCorrect={false}
                                        autoCapitalize="words"
                                        allowFontScaling={false}
                                        maxLength={80}
                                        placeholderTextColor="#999"
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
                                    <Icon name="person-outline" size={28} color="#2D2D2D" />
                                    <Input
                                        inputRef={usernameRTextInput}
                                        onSubmitEditing={() => epostaRTextInput.current.focus()}
                                        blurOnSubmit={false}
                                        style={styles.registerTextInput}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        allowFontScaling={false}
                                        maxLength={80}
                                        placeholderTextColor="#999"
                                        placeholder="Kullanıcı Adı"
                                        returnKeyType={"next"}
                                        value={Username}
                                        onChangeText={value => setUsername(value)}
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
                                        placeholderTextColor="#999"
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
                                        placeholderTextColor="#999"
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

                    <View style={Style.registerItemProfile}>
                        <Button2
                            title={selectedType === 0 ? "Giriş Yap" : "Kayıt Ol"}
                            onPress={selectedType === 0 ? OnLoginButtonClicked : onRegisterButtonClicked}
                            style={{
                                padding: 8,
                                color: '#000',
                                backgroundColor: '#FFF',
                                fontWeight: '700'
                            }}
                        />
                    </View>

                </View>


                <View style={styles.ButtonWrapper}>
                    <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
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
        fontFamily: "SFProDisplay-Medium",
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
