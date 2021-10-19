import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Divider } from 'react-native-elements';
import { auth, firestore } from '../../config/config';
import { View, Text } from 'react-native-ui-lib'; //eslint-disable-line
import moment from 'moment';
import 'moment/locale/tr';
import { useNavigation } from '@react-navigation/core';

const Post = ({ post }) => {

    const handleLike = async post => {
        const currentLikeStatus = !post.likes_by_users.includes(auth().currentUser.email)

        try {
            await firestore().collection('users')
                .doc(post.owner_email)
                .collection('posts')
                .doc(post.id)
                .update({
                    likes_by_users: currentLikeStatus
                        ?
                        firestore.FieldValue.arrayUnion(auth().currentUser.email)
                        :
                        firestore.FieldValue.arrayRemove(auth().currentUser.email)
                })
        } catch (error) {
            console.log('error updating', error)
        }
    }
    return (
        <View style={{ marginBottom: 30 }}>
            <Divider width={1} orientation='vertical' />
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <PostFooter post={post} handleLike={handleLike} />
                <Likes post={post} />
                <Caption post={post} />
                <CommentsSection post={post} />
                <Comments post={post} />
            </View>
        </View>
    )
}

const PostHeader = ({ post }) => (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center'
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: post.profile_picture }} style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                marginLeft: 6,
                borderWidth: 1.6,
                borderColor: '#ff8501'
            }} />

            <View style={{
                marginLeft: 10
            }}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>{post.user}</Text>
                <Text style={{ color: 'gray' }}>{post?.createdAt?.seconds !== undefined ? moment(post?.createdAt?.seconds * 1000).fromNow() : moment().fromNow()}</Text>
            </View>
        </View>

        <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ color: '#FFF', fontWeight: '900', textAlign: 'right' }}>...</Text>
        </TouchableOpacity>
    </View>
)

const PostImage = ({ post }) => (
    <View style={{
        width: '100%',
        paddingHorizontal: 20,
        height: 300
    }}>
        <Image
            source={{ uri: post.imageUrl }}
            style={{ height: '100%', resizeMode: 'cover', borderRadius: 12 }}
        />
    </View>
)

const PostFooter = ({ handleLike, post }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.leftFooterIconsContainer}>
            <Icon onPressButton={() => handleLike(post)} iconName={post.likes_by_users.includes(auth().currentUser.email) ? "heart" : "hearto"} iconSize={24} />
            <Icon onPressButton={() => navigation.navigate('PostComments', { comments: post.comments })} style={{ marginTop: 5 }} iconName="message1" iconSize={24} />
        </View>
    )
}

const Icon = ({ iconName, iconSize, onPressButton, iconColor }) => (
    <TouchableOpacity onPress={onPressButton} >
        <AntDesign name={iconName} size={iconSize} color={iconColor ? iconColor : "#fff"} />
    </TouchableOpacity >
)

const Likes = ({ post }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => post.likes_by_users.length > 0 ? navigation.navigate('LikedUsers', { likedUsers: post.likes_by_users }) : null}
            style={{
                flexDirection: 'row',
                marginTop: 10
            }}
        >
            <Text style={{ color: '#fff', fontWeight: '600' }}>{post.likes_by_users.length.toLocaleString('en')} beğeni</Text>
        </TouchableOpacity>
    )
}

const Caption = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        <Text style={{ color: '#fff' }}>
            <Text style={{ fontWeight: '600' }}>{post.user}</Text>
            <Text> {post.caption}</Text>
        </Text>
    </View>
)

const CommentsSection = ({ post }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('PostComments', { comments: post.comments })} style={{ marginTop: 5 }}>
            {!!post.comments.length && (
                <Text style={{ color: 'gray' }}>
                    {post.comments.length}{' '}
                    {post.comments.length > 1 ? 'yorum' : 'yorum'}
                </Text>
            )}
        </TouchableOpacity>
    )
}

const Comments = ({ post }) => (
    <>
        {post.comments.map((comment, index) => (
            <TouchableOpacity key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ color: '#fff' }}>
                    <Text style={{ fontWeight: '600' }}>{comment.user}</Text>{' '}
                    {comment.comment}
                </Text>
            </TouchableOpacity>
        ))}
    </>
)


const styles = StyleSheet.create({
    leftFooterIconsContainer: {
        flexDirection: 'row',
        width: '20%',
        justifyContent: 'space-between'
    }
})

export default Post;