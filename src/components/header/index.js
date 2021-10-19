import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const Header = ({ title, showMenuOnPress, showBack, showAddPost }) => {
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

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                {showAddPost === true ?
                    <Pressable onPress={() => navigation.navigate('NewPost')}>
                        <Icon name={"post-add"} color="#FFF" size={28} style={{ marginRight: 20 }} />
                    </Pressable>
                    :
                    <Pressable onPress={() => navigation.navigate('Settings')}>
                        <Icon name={"settings"} color="#FFF" size={28} style={{ marginRight: 20 }} />
                    </Pressable>
                }

                <Pressable onPress={() => navigation.navigate('Notifications')}>
                    <Icon name={"notifications"} color="#FFF" size={28} />
                </Pressable>
            </View>
        </View>
    )
}

export default Header;