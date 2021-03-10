import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { auth2, database2 } from '../../config/config';
import { ProgressChart } from 'react-native-chart-kit';
import SpinnerLoading from '../../components/SpinnerLoading';

const screenWidth = Dimensions.get("window").width;

const Profile = props => {


    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.user.users);

    const data = {
        labels: ["Kalori", "Adım Sayısı", "Egzersiz"],
        data: [0.4, 0.6, 0.8]
    };

    const chartConfig = {
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `#FFF`,
        strokeWidth: 1,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SpinnerLoading Loading={Loading} />

            <Text style={{ color: '#FFF' }}>Hoşgeldin, {profileData.firstname + ' ' + profileData.lastname}</Text>


            <View style={{ alignItems: 'center', width: '100%', marginRight: 70 }}>
                <ProgressChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                />
            </View>


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