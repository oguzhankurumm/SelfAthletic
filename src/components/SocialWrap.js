import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Zocial';

export default function SocialWrap({ title, style, onPress, icon, iconcolor }) {
    return (
        <TouchableOpacity style={style} onPress={onPress} >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} color={iconcolor} size={18} />
            </View>
        </TouchableOpacity>
    )
}