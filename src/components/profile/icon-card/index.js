import React from 'react'
import { View, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './style';

const IconCard = ({ icon, title, value }) => {
    return (
        <View style={styles.iconsContainer} >
            <AntDesign name={icon} color="yellow" size={32} style={{ marginBottom: 10 }} />
            <Text style={styles.iconsText}>{title}</Text>
            <Text style={styles.iconsNumber}>{value}</Text>
        </View>
    )
}

export default IconCard;