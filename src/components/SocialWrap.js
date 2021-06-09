import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

export default function SocialWrap({ title, style, onPress, icon, iconcolor, textStyle }) {
    return (
        <TouchableOpacity style={style} onPress={onPress} >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Icon name={icon} color={iconcolor} size={20} />
                <Text style={textStyle}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}