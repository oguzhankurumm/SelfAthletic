import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Header = () => {
    return (
        <View style={styles.header} >
            <Text style={styles.headerText}>SelfAthletic</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#FFF'

    }
})

export default Header
