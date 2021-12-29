import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './style';

const BottomButton = ({ title, onPress }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.container}
            >
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BottomButton;