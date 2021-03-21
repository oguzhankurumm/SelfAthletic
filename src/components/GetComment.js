import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GetComment = props => {
    console.log('propsssss: ', props.item)
    return (
        <View onPress={() => console.log('item: ', props.item)} style={{ width: '100%', marginTop: 20 }}>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15 }}>
                <Image
                    source={{ uri: 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg' }}
                    style={{ width: 40, height: 40, borderRadius: 50 }} />
                <Text numberOfLines={1} style={styles.textStyle}>{props.item.name}</Text>
            </View>

            <View style={{ width: '100%', paddingHorizontal: 20, backgroundColor: '#FFF', height: 150, borderRadius: 18, padding: 20 }}>
                <Text style={{
                    fontFamily: 'SFProDisplay-Bold',
                    fontSize: 16,
                    color: '#000',
                    marginBottom: 8
                }}>{props.item.comment}</Text>
            </View>

        </View >
    )
}

const styles = StyleSheet.create({
    CardStyle: {
        width: '100%',
        borderRadius: 18,
    },
    textStyle: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 15,
        color: '#FFF',
        marginLeft: 10
    }
})

export default GetComment;