import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { database2, auth2 } from '../../config/config';

const { height, width } = Dimensions.get("window");

const Settings = ({ navigation }) => {
    moment.locale('tr');

    const [Loading, setLoading] = useState(false);

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <KeyboardAwareView animated={true} style={{ flex: 1 }} >

                <SafeAreaView style={styles.container}>

                    <SpinnerLoading Loading={Loading} />

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Ayarlar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: 10 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('KisiselBilgiler')} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Kişisel Bilgiler</Text>
                            <Icon name="keyboard-arrow-right" size={28} color="#2D2D2D" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('HedefAyarlari')} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Hedef Ayarları</Text>
                            <Icon name="keyboard-arrow-right" size={28} color="#2D2D2D" />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => navigation.navigate('SaglikSorunlari')} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Sağlık Sorunları</Text>
                            <Icon name="keyboard-arrow-right" size={28} color="#2D2D2D" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('BildirimAyarlari')} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Bildirim Ayarları</Text>
                            <Icon name="keyboard-arrow-right" size={28} color="#2D2D2D" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('AntrenmanGunleri')} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Antrenman Günleri</Text>
                            <Icon name="keyboard-arrow-right" size={28} color="#2D2D2D" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            Alert.alert('Çıkış Yap', 'Hesabınızdan çıkılsın mı?', [
                                {
                                    text: 'Evet', onPress: () => {
                                        setLoading(true);
                                        auth2.signOut()
                                            .then(() => {
                                                setLoading(false);
                                            })
                                            .catch((err) => {
                                                console.log('Hata: ', err)
                                            })
                                    }, style: 'default'
                                },
                                { text: 'Vazgeç', onPress: () => null, style: 'cancel' }
                            ])
                        }} style={[styles.textContainer, { backgroundColor: '#FFF', marginTop: 10, height: 70 }]}>
                            <Text style={styles.textStyleHeader}>Çıkış Yap</Text>
                            <Icon name="lock-outline" size={25} color="#2D2D2D" />
                        </TouchableOpacity>

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
