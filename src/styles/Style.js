import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'

export const SCREEN_HEIGHT = Dimensions.get('window').height
export const SCREEN_WIDTH = Dimensions.get('window').width


const Style = StyleSheet.create({
    registerItemProfile: {
        // paddingHorizontal: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    registerTextInput: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E9E9E9',
        color: "#4D4D4D",
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
        borderRadius: 12
    },
    registerTextStyle: {
        color: 'white',
        // fontFamily: "SFProDisplay-Medium",
        fontSize: 16,
        fontWeight: '500'
    },
    PhoneinputContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 10
    },
    Phoneprefix: {

        paddingHorizontal: 10,
        color: "#4D4D4D",
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium"
    },
    loginHeaderText: {
        color: '#2D2D2D',
        // fontFamily: "SFProDisplay-Bold",
        fontSize: 34,
        lineHeight: 40,
        marginTop: 10
    },
    loginDescText: {
        color: '#ACB1C0',
        // fontFamily: "SFProDisplay-Medium",
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 22,
        marginTop: 10
    },
    LoginItemProfile: {
        width: '100%',
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    LoginTextInput: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F1F2F6',
        color: "#4D4D4D",
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
        borderRadius: 12
    },
    LoginForgot: {
        color: '#7D7D7D',
        // fontFamily: "SFProDisplay-Medium",
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 22,
        marginTop: 10
    },
    welcomeHeaderText: {
        color: '#FFF',
        // fontFamily: "SFProDisplay-Bold",
        fontSize: 34,
        lineHeight: 40,
        textAlign: 'center'
    },
    welcomeSocialText: {
        color: '#FFF',
        // fontFamily: "SFProDisplay-Bold",
        fontSize: 18,
        fontWeight: '500'
    },
    WelcomeSignIn: {
        color: 'white',
        fontFamily: "SFProDisplay-Medium",
        fontSize: 15,
        fontWeight: '400',
        // lineHeight: 22
    },
    WelcomeSignIn2: {
        color: 'rgba(255,255,255,0.50)',
        // fontFamily: "SFProDisplay-Medium",
        fontSize: 17,
        fontWeight: '400',
        marginTop: 40,
        lineHeight: 22
    }
})

export default Style;
