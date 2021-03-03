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
import { auth2 } from '../../config/config';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { Button } from 'native-base';

const { width, height } = Dimensions.get("window");

const Welcome = ({ navigation }) => {

    const [selectedType, setselectedType] = useState(0);
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ShowPassword, setShowPassword] = useState(true);
    const [Loading, setLoading] = useState(false);

    const OnButtonClicked = () => {
        Keyboard.dismiss()
        setLoading(true);
        setTimeout(() => {
            auth2.signInWithEmailAndPassword(Email, Password)
                .then((res) => LoginSuccess(res))
                .catch((err) => LoginFailed(err))
        }, 200);
    }

    const LoginSuccess = (res) => {
        console.log('ress: ', res)
        setLoading(false);
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

    const onRegisterButtonClicked = async () => {
        Keyboard.dismiss()
        setLoading(true);

        await auth2.createUserWithEmailAndPassword(Email, Password)
            .then((response) => {
                console.log('REGISTER: ', response)
            })
            .catch((err) => {
                console.log('HATA: ', err)
            })

    }

    return (
        <KeyboardAwareView animated={true} style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFF' }} >

            <StatusBar barStyle="light-content" />
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
                                <Text allowFontScaling={false} style={{ fontSize: 15, color: selectedType === 0 ? "#000" : "#FFF", textAlign: 'center' }}>Giriş Yap</Text>
                            </Button>

                            <Button onPress={() => {
                                setselectedType(1);
                            }} full style={{ flexDirection: 'row', backgroundColor: selectedType === 1 ? "#FFF" : "#000", height: 40, width: '50%', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                                <Text allowFontScaling={false} style={{ fontSize: 15, color: selectedType === 1 ? "#000" : "#FFF", textAlign: 'center' }}>Kayıt Ol</Text>
                            </Button>
                        </View>
                    </View>

                    {selectedType === 0 ?
                        <Card style={{ borderRadius: 12, padding: 10, width: '100%' }}>

                            <View style={styles.registerItemProfile}>
                                <Icon name="mail-outline" size={28} color="#2D2D2D" />
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="E-Posta"
                                    returnKeyType={"next"}
                                    value={Email}
                                    onChangeText={email => setEmail(email)}
                                    keyboardType={"email-address"}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 0.5, backgroundColor: '#4D4D4D' }} />
                            </View>

                            <View style={styles.registerItemProfile}>
                                <Icon name="lock-outline" size={28} color="#2D2D2D" />
                                <Input
                                    style={styles.registerTextInput}
                                    allowFontScaling={false}
                                    blurOnSubmit={true}
                                    maxLength={30}
                                    placeholder="Parola"
                                    returnKeyType={"done"}
                                    autoCapitalize="none"
                                    secureTextEntry={ShowPassword}
                                    value={Password}
                                    onChangeText={password => setPassword(password)}
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
                                        style={styles.registerTextInput}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        allowFontScaling={false}
                                        maxLength={100}
                                        placeholder="E-Posta"
                                        returnKeyType={"next"}
                                        value={Email}
                                        onChangeText={email => setEmail(email)}
                                        keyboardType={"email-address"}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1, height: 0.5, backgroundColor: '#4D4D4D' }} />
                                </View>

                                <View style={styles.registerItemProfile}>
                                    <Icon name="lock-outline" size={28} color="#2D2D2D" />
                                    <Input
                                        style={styles.registerTextInput}
                                        allowFontScaling={false}
                                        blurOnSubmit={true}
                                        maxLength={30}
                                        placeholder="Parola"
                                        returnKeyType={"done"}
                                        autoCapitalize="none"
                                        secureTextEntry={ShowPassword}
                                        value={Password}
                                        onChangeText={password => setPassword(password)}
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

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginTop: 10, marginBottom: 40 }}>
                        <SocialWrap style={[styles.Socials, { marginRight: 10, backgroundColor: '#FFF' }]} icon="facebook" iconcolor="#4267B2" />
                        <SocialWrap style={[styles.Socials, { backgroundColor: '#FFF' }]} icon="google" iconcolor="#4C8BF5" />
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={Style.WelcomeSignIn}>Şifremi Unuttum</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </KeyboardAwareView>

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
        paddingHorizontal: 30,
        alignItems: 'center',
        flexDirection: 'column'
    },
    ButtonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Socials: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 50
    },
    registerTextInput: {
        width: '85%',
        padding: 10,
        color: "#2d2d2d",
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
    },
    registerItemProfile: {
        // width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})
export default Welcome;
