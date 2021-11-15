import React from 'react'
import { Text, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const SettingsCard = ({ title, icon, onPress }) => (
    <Pressable onPress={onPress} style={[styles.textContainer, { backgroundColor: '#202026', marginTop: 10, height: 70 }]}>
        <Text style={styles.textStyle}>{title}</Text>
        <MaterialIcons name={icon} size={28} color="#FFF" />
    </Pressable>
)

export default SettingsCard;