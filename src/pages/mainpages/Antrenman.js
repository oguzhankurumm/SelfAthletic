import React from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';

const Antrenman = () => {


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default Antrenman;