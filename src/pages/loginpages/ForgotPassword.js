import React, { useState } from 'react';
import { View, Keyboard, Alert, Image } from 'react-native';
import { auth2 } from '../../config/config';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Style from '../../styles/Style';
import SpinnerLoading from '../../components/SpinnerLoading';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import Logo from '../../img/self_logo.png';

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
            auth2.sendPasswordResetEmail(Email).then(function (user) {
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
        <KeyboardAwareView animated={true} style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFF', height: '100%', width: '100%' }} >
            <SpinnerLoading Loading={Loading} />

            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 30, marginTop: 50 }}>

                <Image
                    source={Logo}
                    style={{
                        width: 300,
                        height: 100,
                        resizeMode: 'contain',
                        marginBottom: 50
                    }}
                />

                <View style={Style.registerItemProfile}>
                    <Input
                        style={Style.registerTextInput}
                        autoCapitalize="none"
                        allowFontScaling={false}
                        blurOnSubmit={true}
                        maxLength={70}
                        placeholder="E-Posta Adresiniz"
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
                            color: 'white',
                            backgroundColor: '#000',
                            fontWeight: '700'
                        }}
                    />
                </View>

            </View>
        </KeyboardAwareView>
    )
}

export default ForgotPassword;
