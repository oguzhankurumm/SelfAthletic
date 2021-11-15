import React from 'react'
import { Text, ImageBackground, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';

const PressableCard = ({ image, title, onPress }) => {

    return (
        <ImageBackground source={image} style={styles.imageContainer} imageStyle={{ borderRadius: 12 }} >
            <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.linear}
            />
            <Pressable
                onPress={onPress}
                style={styles.container}
            >
                <Icon name="chevron-right" color="yellow" size={26} />
                <Text style={styles.iconText}>{title}</Text>
            </Pressable>
        </ImageBackground>
    )
}

export default PressableCard;