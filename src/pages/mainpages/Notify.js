import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { Button } from 'native-base';
import messaging from '@react-native-firebase/messaging';
import { database2, auth2 } from '../../config/config';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';

const Notify = (props) => {

    const checkLocation = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (response === 'granted') {
                props.navigation.navigate('UyelikTamam');
            } else {
                props.navigation.navigate('Location');
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

            if (response === 'granted') {
                props.navigation.navigate('UyelikTamam');
            } else {
                props.navigation.navigate('Location');
            }
        }
    }

    const configNtf = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },

            onNotification: function (notification) {
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,

            requestPermissions: Platform.OS === 'ios'
        });

    }

    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            await database2.ref('tokens').child(auth2.currentUser.uid).set(fcmToken)
                .then(() => {
                    configNtf();
                    checkLocation();
                })
                .catch((err) => console.log('error', err))
        } else {
            requestUserPermission();
        }
    }

    const izinVerme = async () => {
        props.navigation.navigate('UyelikTamam');
    }

    const requestUserPermission = async () => {

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            getFcmToken();
        } else {
            Alert.alert(
                "Bildirim İzni",
                "İzin vermek için ayarlara gitmelisiniz.",
                [
                    {
                        text: 'Ayarlara Git', onPress: () => openSettings().catch(() => console.log('cannot open settings'))
                    }
                ],
                { cancelable: false }
            );
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}
            >
                <Image source={require('../../img/notifyicon.png')} />
                <Text style={{ fontSize: 24, lineHeight: 40, fontFamily: 'SFProDisplay-Bold', color: '#1E2432', marginTop: 48, textAlign: 'center' }}>Bildirimleri Aç</Text>
                <Text style={{ fontSize: 15, lineHeight: 22, fontFamily: 'SFProDisplay-Medium', color: '#7D7D7D', marginTop: 17, fontWeight: '300', textAlign: 'center' }}>Size özel indirimleri anında bildirebilmemiz için bildirimleri etkinleştirelim mi?</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        onPress={() => requestUserPermission()}
                        style={{ marginTop: 30, backgroundColor: "#624ae8", height: 50, width: '80%', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}
                    >
                        <Text allowFontScaling={false} style={{ fontSize: 18, color: '#F1F1F1', fontFamily: "SFProDisplay-Medium", textAlign: 'left' }}>İzin Ver</Text>
                    </Button>
                </View>
            </View>

            <TouchableOpacity style={{ flex: 1, backgroundColor: 'red' }} onPress={() => izinVerme()}
                style={{
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    backgroundColor: '#624ae8',
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <Text allowFontScaling={false} style={{
                    fontSize: 16,
                    color: 'white',
                    fontFamily: "SFProDisplay-Bold"
                }}>İzin Vermeden Devam Et</Text>
            </TouchableOpacity>
        </SafeAreaView>

    );
}

export default Notify;