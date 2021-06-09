import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FeedPost = props => {
    const likeCount = props.item.likes !== undefined ? parseFloat([props.item.likes].length + 1) : 0
    const commentCount = props.item.comments !== undefined ? parseFloat([props.item.comments].length + 1) : 0

    const type = props.item.type !== undefined ? props.item.type : 'text';

    const renderPost = () => {

        if (type === 'text') {
            return (
                <TouchableOpacity onPress={() => props.navigation.navigate('FeedDetails', { item: props.item })} style={{ width: '100%', paddingHorizontal: 20, backgroundColor: '#202026', height: 150, borderRadius: 18, padding: 20 }}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        fontSize: 16,
                        color: '#FFF',
                        marginBottom: 8
                    }}>{props.item.title}</Text>
                </TouchableOpacity>
            )
        }

        if (type === 'image') {
            return (
                <TouchableOpacity onPress={() => props.navigation.navigate('FeedDetails', { item: props.item })} style={{ width: '100%', height: 200, borderRadius: 18 }}>
                    <Image style={{ width: '100%', height: 200, borderRadius: 18 }} resizeMode="cover" source={{ uri: props.item.link }} />
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={{ width: '100%', marginTop: 20 }}>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15 }}>
                <Image
                    source={{ uri: props.item.avatar ? props.item.avatar : 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg' }}
                    style={{ width: 40, height: 40, borderRadius: 50 }} />
                <Text numberOfLines={1}
                    style={styles.textStyle}>{props.item.name}
                </Text>
            </View>

            {renderPost()}

            <View style={{ width: '100%', marginTop: 10, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="favorite" size={24} color='#FFF' />
                    <Text style={styles.textStyle}>{likeCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                    <Icon name="comment" size={24} color='#FFF' />
                    <Text style={styles.textStyle}>{commentCount}</Text>
                </TouchableOpacity>

            </View>

        </View>
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
    },
    postText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#000',
    }
})

export default FeedPost;