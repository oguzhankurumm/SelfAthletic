import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function Button({ title, style, onPress }) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress} >
            <Text style={style}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'pink',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 12
    }
})