import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get("window");

export default function Loading() {

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ImageBackground
                source={require('../assets/img/splash.jpg')}
                style={{ width, height, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>

                <ActivityIndicator size="large" color="#d1dc26" animating={true} style={{ position: 'absolute', bottom: 100 }} />
            </ImageBackground>
        </View >
    );
}
