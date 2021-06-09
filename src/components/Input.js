import React from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'

export default function Input({ style, ...props }) {
    const { inputRef } = props;
    return <TextInput {...props} ref={inputRef} style={[styles.input, style]} />
}

const styles = StyleSheet.create({
    input: {
        // backgroundColor: 'green'
    }
})