import React from 'react'
import { View, Text, Pressable } from 'react-native';
import WorkoutLayout from '../../../components/workout-layout';
import LottieView from "lottie-react-native";
import themeColors from '../../../styles/colors';
import styles from './style';

const WorkoutCompleted = ({ navigation }) => {

    const GoHome = async () => {
        navigation.navigate('Home');
    }

    return (
        <WorkoutLayout>
            <View style={{ width: '100%', height: '100%', paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', bottom: 60 }}>
                <LottieView
                    style={{ height: 250, alignSelf: "center", marginBottom: 10 }}
                    source={require("../../../animations/check-mark.json")}
                    autoPlay
                    speed={0.5}
                    loop={false}
                    colorFilters={[
                        {
                            keypath: 'Circle Green Fill',
                            color: themeColors.yellow,
                        },
                        {
                            keypath: 'Circle Stroke',
                            color: themeColors.yellow,
                        },
                        {
                            keypath: 'Circle Flash',
                            color: themeColors.white
                        }
                    ]}
                />

                <Text allowFontScaling={false} style={styles.headerText}>Antrenman Kaydedildi!</Text>
                <Text allowFontScaling={false} style={styles.subText}>Antrenman başarıyla kaydedildi, daha fazla antrenman yaparak daha fazla puan kazanabilirsiniz.</Text>

            </View>

            <Pressable
                style={styles.bottomButton}
                onPress={GoHome}>
                <Text style={styles.textStyle}>Ana Sayfaya Dön</Text>
            </Pressable>

        </WorkoutLayout>
    )
}

export default WorkoutCompleted;