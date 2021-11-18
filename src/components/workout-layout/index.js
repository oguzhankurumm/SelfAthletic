import React from 'react';
import { View, ImageBackground, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import SpinnerLoading from '../SpinnerLoading';
import styles from './style';

const WorkoutLayout = ({ children, Loading }) => {
    const { width, height } = Dimensions.get("window");

    return (
        <ImageBackground
            style={{ height: height, width: width }}
            resizeMode="cover"
            source={require('../../assets/img/bg.jpg')}
        >
            <StatusBar barStyle="light-content" />
            <SpinnerLoading Loading={Loading} />
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    {children}
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default WorkoutLayout;