import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const WodImageCard = ({ item }) => {
    const navigation = useNavigation();

    return (
        <Pressable
            key={item.id}
            onPress={() => navigation.navigate('WodDetails', { data: item })}
            style={styles.scrollCardContainer}>
            <Image
                resizeMode="cover"
                source={{ uri: item.image }}
                style={styles.scrollImage}
            />
            <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(0,0,0,0.6)', 'transparent']}
                style={styles.linear}
            />
            <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
            </View>

            <View style={styles.itemContainer}>

                <View style={styles.itemSubContainer}>
                    <Icon name="star" color="#FFF" size={20} />
                    <Text numberOfLines={2} style={styles.pointText}>{String(parseFloat(item.point))} Puan</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Icon name="directions-run" color="#FFF" size={20} />
                    <Text style={styles.caloriesText}>{String(parseFloat(item.calories))} Kalori</Text>
                </View>

            </View>
        </Pressable>
    )
}

export default WodImageCard;