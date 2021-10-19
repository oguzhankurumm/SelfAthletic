import React, { useState } from 'react';
import { View, Keyboard, Alert, Text, ImageBackground, Dimensions } from 'react-native';
import { auth } from '../../config/config';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Style from '../../styles/Style';
import SpinnerLoading from '../../components/SpinnerLoading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height, width } = Dimensions.get("window");

function ForgotPassword({ navigation }) {
    const [Email, setEmail] = useState('');
    const [Loading, setLoading] = useState(false);

    const OnButtonClicked = () => {
        Keyboard.dismiss()
        setLoading(true);
        ForgotPassword();
    }

    const ForgotPassword = async () => {
        setLoading(true);

        if (Email != '') {
            auth().sendPasswordResetEmail(Email).then(function (user) {
                Alert.alert("Tebrikler!", "Parola sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin. Sıfırladıktan sonra yeni parolanızla giriş yapabilirsiniz.");
            }).catch((e) => {
                if (e.code == "auth/invalid-email") {
                    Alert.alert("Hata", "E-posta formatı doğru görünmüyor.")
                }

                if (e.code == "auth/user-not-found") {
                    Alert.alert("Hata", "Bu e-posta adresine ilişkin bir hesap bulunamadı.")
                }

                if (e.code !== "auth/invalid-email" && e.code !== "auth/user-not-found") {
                    Alert.alert("Hata", String(e.message))
                }
            })
            setLoading(false);
        } else {
            Alert.alert("Hata", "E-posta boş olamaz.")
            setLoading(false);
        }

    };

    return (
        <KeyboardAwareScrollView extraHeight={150} enableOnAndroid={true} animated={true} style={{
            flex: 1, flexDirection: 'column', backgroundColor: '#FFF'
        }}>
            <SpinnerLoading Loading={Loading} />

            <ImageBackground style={{ height: height, width: '100%' }} resizeMode="cover" source={require('../../img/bg.jpg')}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, marginTop: 100 }}>

                    <View style={{ width: '100%', paddingVertical: 30 }}>
                        <Text allowFontScaling={false} style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 16, color: '#FFF', textAlign: 'left' }}>Lütfen hesabınıza ilişkin e-posta adresinizi girin. Yeni parola oluşturmak için bir bağlantı alacaksınız.</Text>
                    </View>


                    <View style={Style.registerItemProfile}>
                        <Input
                            style={[Style.registerTextInput, { backgroundColor: '#202026', color:'#FFF' }]}
                            autoCapitalize="none"
                            allowFontScaling={false}
                            blurOnSubmit={true}
                            maxLength={70}
                            placeholder="E-Posta Adresiniz"
                            placeholderTextColor='#FFF'
                            fontFamily='SFProDisplay-Medium'
                            fontWeight='500'
                            fontSize={15}
                            returnKeyType={"done"}
                            value={Email}

                            onChangeText={email => setEmail(email)}
                            keyboardType={"email-address"}
                        />
                    </View>

                    <View style={[Style.registerItemProfile, { marginTop: 30 }]}>
                        <Button
                            title="Parolamı Yenile"
                            onPress={() => OnButtonClicked()}
                            style={{
                                color: 'yellow',
                                backgroundColor: '#000',
                                fontWeight: '700'
                            }}
                        />
                    </View>

                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

export default ForgotPassword;
