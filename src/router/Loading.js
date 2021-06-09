import React from 'react';
import { View, Text, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default function Loading() {

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ImageBackground
                source={require('../img/loading_bg.jpg')}
                style={{ width, height, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>

                <ActivityIndicator size='large' color="#FFF" animating={true} />
                <View style={{ marginTop: 10 }}></View>
                <Text allowFontScaling={false} style={{ fontSize: 12, color: '#FFF' }}>Yükleniyor...</Text>

            </ImageBackground>
        </View >
    );
}
