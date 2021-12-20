import React from 'react';
import { View, ImageBackground, Pressable, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import SpinnerLoading from '../SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const WorkoutLayout = ({ children, Loading }) => {
    const navigation = useNavigation();
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
                <View style={{ paddingHorizontal: 20, marginBottom: 5 }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={32} color="#FFF" />
                    </Pressable>
                </View>
                <View style={styles.container}>
                    {children}
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default WorkoutLayout;