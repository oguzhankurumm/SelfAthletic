import React from 'react'
import { View, Text } from 'react-native';
import { Bar } from 'react-native-progress';
import themeColors from '../../../styles/colors';
import styles from './style';

const LevelCard = ({ currentPoint, levelTitle, levelPoint, progress }) => (
    <View style={styles.container}>
        <View style={styles.levelContainer}>
            <Text style={styles.text}>Seviye {String(levelTitle)}</Text>
        </View>
        <Bar height={4} style={styles.bar} width={null} color={themeColors.yellow} progress={progress} unfilledColor="#9999" borderWidth={0} />
        <View style={styles.levelTextContainer}>
            <Text style={styles.text}>{currentPoint ? parseFloat(currentPoint).toFixed(1) : 0} puan</Text>
            <Text style={styles.text}>{parseFloat(levelTitle) + 1}. seviye için {parseFloat(String(parseFloat(levelPoint) - parseFloat(currentPoint))).toFixed(1)} puan kaldı</Text>
        </View>
    </View>
)

export default LevelCard;