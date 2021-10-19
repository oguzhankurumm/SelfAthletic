import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import styles from './style';

const SliderCard = ({ data }) => {
    const navigation = useNavigation();
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            {data.map((item) => {
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate('SliderDetails', { item: item })}
                        style={styles.container}>

                        <Image
                            resizeMode="cover"
                            source={{ uri: item.image }}
                            style={styles.image}
                        />

                        <LinearGradient
                            start={{ x: 1, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            colors={['rgba(0,0,0,0.9)', 'transparent']}
                            style={styles.linear}
                        />

                        <View style={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
                            <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
                            <Text numberOfLines={2} style={styles.subtitle}>{item.description}</Text>
                        </View>

                    </TouchableOpacity>
                )
            })
            }
        </View>
    )
}

export default SliderCard;