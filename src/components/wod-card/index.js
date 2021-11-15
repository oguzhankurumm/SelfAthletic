import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import WodImageCard from '../wod-image-card';

const WodCard = ({ data }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Antrenmanlar</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('WorkoutList', { Workouts: data })}
                    style={styles.seeAllButton}>
                    <Text style={styles.subTitleStyle}>Tümünü Gör</Text>
                    <Icon name="keyboard-arrow-right" size={18} color="yellow" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.scrollContainer}
            >
                {data.map((item, index) => {
                    return <WodImageCard key={index} item={item} />
                })}
            </ScrollView>
        </View>
    )
}

export default WodCard;