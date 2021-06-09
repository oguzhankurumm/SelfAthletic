import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, TextInput } from 'react-native';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import { useSelector } from 'react-redux';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { database2, auth2 } from '../../config/config';

const { height, width } = Dimensions.get("window");

const AddWater = props => {

    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.user.users);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowAlertError, setShowAlertError] = useState(false);
    const [AlertSuccessTitle, setAlertSuccessTitle] = useState("Başarılı");
    const [AlertSuccessSubTitle, setAlertSuccessSubTitle] = useState("içtiğiniz su değeri kaydedildi");
    const [WaterType, setWaterType] = useState(0);
    const [WaterValue, setWaterValue] = useState("");


    const AddWater = async () => {
        setLoading(true);
        const date = moment().format("DD-MM-YYYYTHH:mm:ss");

        var obj = {
            value: parseFloat(WaterValue),
            type: parseFloat(WaterType),
            date: date
        }

        if (WaterValue !== "" && WaterValue > 0) {
            database2.ref(`users/${auth2.currentUser.uid}/waters`).push(obj)
                .then(() => {
                    setWaterValue("");
                    setLoading(false);
                    setShowAlert(true);
                })
                .catch((err) => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', String(err));
                    }, 200);
                })
        } else {
            setLoading(false);
            setShowAlertError(true);
        }
    }


    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <SCLAlert
                    theme="success"
                    show={ShowAlert}
                    title={AlertSuccessTitle}
                    subtitle={AlertSuccessSubTitle}
                >
                    <SCLAlertButton theme="success" onPress={() => setShowAlert(!ShowAlert)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="danger"
                    show={ShowAlertError}
                    title={"Hata"}
                    subtitle={"Lütfen tüm bilgileri eksiksiz girin."}
                >
                    <SCLAlertButton theme="danger" onPress={() => setShowAlertError(!ShowAlertError)}>Tekrar Dene</SCLAlertButton>
                </SCLAlert>

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Su Ekle</Text>
                    </View>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 20 }}>

                    <View style={{ width: '100%', marginTop: 30 }}>
                        <Text style={[styles.headerText, { fontSize: 16 }]}>İçmeniz gereken su, Dünya Sağlık Örgütü'nün önerisi doğrultusunda {parseFloat(parseFloat(profileData.weight) * parseFloat(0.35)).toFixed(2)} litre olarak hesaplanmıştır.</Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <TouchableOpacity
                            onPress={() => setWaterType(0)}
                            style={WaterType !== 0 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                            <Text style={styles.touchableText}>Bardak (0.2L)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setWaterType(1)}
                            style={WaterType !== 1 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                            <Text style={styles.touchableText}>Litre</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setWaterType(2)}
                            style={WaterType !== 2 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                            <Text style={styles.touchableText}>Şişe (0.5L)</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <Text style={[styles.touchableText, { marginBottom: 15, textAlign: 'left', width: '100%', fontWeight: '700', fontSize: 17 }]}>Ne kadar su içtin?</Text>
                        <TextInput
                            style={{
                                backgroundColor: '#202026',
                                borderWidth: 3,
                                borderColor: '#202026',
                                padding: 10,
                                color: "#FFF",
                                borderRadius: 12,
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 16,
                                height: 70,
                                width: '100%'
                            }}
                            textAlign="left"
                            placeholderTextColor="#FFF"
                            allowFontScaling={false}
                            maxLength={4}
                            value={WaterValue}
                            placeholder={WaterType === 0 ? "Bardak" : WaterType === 1 ? "Litre" : "Şişe"}
                            returnKeyType={"done"}
                            onChangeText={text => setWaterValue(text)}
                            keyboardType="decimal-pad"
                        />
                    </View>

                </View>

                <TouchableOpacity
                    onPress={() => AddWater()}
                    style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: '#202026',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        justifyContent: 'flex-start',
                        fontSize: 16,
                        color: '#FFF',
                        marginRight: 5
                    }}>Su Ekle</Text>
                </TouchableOpacity>
            </SafeAreaView>
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
    touchableText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF'
    },
    touchableStyle: {
        width: '33%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderWidth: 3,
        borderColor: '#202026',
        borderRadius: 12
    }
})
export default AddWater;