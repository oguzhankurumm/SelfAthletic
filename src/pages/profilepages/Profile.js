import React from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { auth2 } from '../../config/config';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const Profile = () => {
    const data = {
        labels: ["Kalori", "Adım Sayısı", "Egzersiz Sayısı"], // optional
        data: [0.4, 0.6, 0.8]
    };

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `#FFF`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ProgressChart
                data={data}
                width={screenWidth}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={false}
            />
            <TouchableOpacity onPress={() => auth2.signOut()}>
                <Text style={{ color: '#FFF' }}>Çıkış Yap</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center'
    }
})
export default Profile;