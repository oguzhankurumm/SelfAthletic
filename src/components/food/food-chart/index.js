import React from 'react'
import { View, Text, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import themeColors from '../../../styles/colors';
import styles from './style';

const { width, height } = Dimensions.get('window');

const FoodCharts = ({ data1, data2, data3, data4, newStyle }) => {

    const RenderItem = ({ title, color, maxValue, currentValue }) => (
        <View style={{ width: width / 4.5, justifyContent: 'center', alignItems: 'center' }}>
            <AnimatedCircularProgress
                size={width / 5.3}
                width={4}
                rotation={90}
                fill={currentValue / maxValue * 100}
                tintColor={color}
                backgroundColor="#4D4D4D"
            >
                {(fill) => (
                    <View style={styles.fillContainer}>
                        <Text style={styles.title}>%{parseFloat(fill).toFixed(1)}</Text>
                    </View>
                )}
            </AnimatedCircularProgress>
            <Text style={styles.subtitle}>{currentValue} / {parseFloat(maxValue).toFixed(0)}{"\n"}{title}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <RenderItem title="Kalori" color={themeColors.yellow} currentValue={1200} maxValue={1800} />
            <RenderItem title="Karbonhidrat" color={themeColors.red} currentValue={120} maxValue={250} />
            <RenderItem title="Protein" color={themeColors.pink} currentValue={64} maxValue={100} />
            <RenderItem title="Yağ" color={themeColors.green} currentValue={85} maxValue={100} />
        </View>
    )
}

export default FoodCharts;