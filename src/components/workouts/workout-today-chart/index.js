import React from 'react'
import { View, Text, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import styles from './style';

const { width, height } = Dimensions.get('window');

const WorkoutTodayChart = ({ calorieCount, stepCount }) => {
    return (
        <View style={styles.container}>

            <View style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
                <AnimatedCircularProgress
                    size={width / 2.5}
                    width={4}
                    rotation={90}
                    fill={100}
                    tintColor="#376F19"
                    backgroundColor="#4D4D4D">
                    {(fill) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Bugün</Text>
                            <Text style={styles.circleHeaderText}>{calorieCount}</Text>
                            <Text style={styles.targetHeader}>Kalori</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>
            </View>

            <View style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
                <AnimatedCircularProgress
                    size={width / 2.5}
                    width={4}
                    rotation={90}
                    fill={100}
                    tintColor="yellow"
                    backgroundColor="#4D4D4D">
                    {(fill) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Bugün</Text>
                            <Text style={styles.circleHeaderText}>{stepCount}</Text>
                            <Text style={styles.targetHeader}>Adım</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>
            </View>
        </View>
    )
}

export default WorkoutTodayChart;