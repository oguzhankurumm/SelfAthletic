import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const HeaderFood = ({ title, showMenuOnPress, showBack, hideRight }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                {showBack === false ?
                    <Pressable onPress={showMenuOnPress}>
                        <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                    </Pressable>
                    :
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" color="#FFF" size={32} style={{ marginRight: 15 }} />
                    </Pressable>
                }
                <Text style={styles.headerText}>{title}</Text>
            </View>

            {hideRight === undefined &&
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Pressable onPress={() => navigation.navigate('AddWater')}>
                        <Image source={require('../../assets/img/suekle.png')} resizeMode='contain' style={{ width: 48, height: 48, tintColor: '#B6D7E4' }} />
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Settings')}>
                        <Icon name={"settings"} color="#FFF" size={28} style={{ marginRight: 20 }} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Notifications')}>
                        <Icon name={"notifications"} color="#FFF" size={28} />
                    </Pressable>
                </View>
            }
        </View>
    )
}

export default HeaderFood;