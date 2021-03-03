import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SocialButton({ title, style, onPress, icon }) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress} >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ marginRight: 15 }} name={icon} color="white" size={25} />
                <Text style={style}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 15,
        borderRadius: 10
    }
})