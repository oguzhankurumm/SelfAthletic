import React from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'

export default function Input({ style, ...props }) {
    return <TextInput {...props} style={[styles.input, style]} />
}

const styles = StyleSheet.create({
    input: {
        // backgroundColor: 'green'
    }
})